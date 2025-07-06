import Logger from "@/lib/Logger";
import prisma from "@/lib/prisma";
import { BaseService } from "./BaseService";

/**
 * SearchService handles full-text search across projects, sections, and pages
 * Uses PostgreSQL full-text search capabilities for efficient searching
 */
export class SearchService extends BaseService {
  /**
   * Perform full-text search across projects, sections, and pages
   * @param {string} query - Search query string
   * @param {string} workspaceId - Current workspace ID to limit search scope
   * @param {number} limit - Maximum number of results to return (default: 20)
   * @returns {Promise<Array>} Array of search results with metadata
   */
  static async searchAll(query, workspaceId, limit = 20) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const searchTerm = query.trim();
      const results = [];

      Logger.info(
        `Searching for: "${searchTerm}" in workspace: ${workspaceId}`,
        "SearchService.searchAll"
      );
      console.log(`[DEBUG] SearchService.searchAll - Starting search for: "${searchTerm}"`);

      // Search in projects
      const projectResults = await this.searchProjects(searchTerm, workspaceId);
      console.log(
        `[DEBUG] SearchService.searchAll - Found ${projectResults.length} projects:`,
        projectResults
      );
      results.push(...projectResults);

      // Search in sections
      const sectionResults = await this.searchSections(searchTerm, workspaceId);
      console.log(
        `[DEBUG] SearchService.searchAll - Found ${sectionResults.length} sections:`,
        sectionResults
      );
      results.push(...sectionResults);

      // Search in pages
      const pageResults = await this.searchPages(searchTerm, workspaceId);
      console.log(
        `[DEBUG] SearchService.searchAll - Found ${pageResults.length} pages:`,
        pageResults
      );
      results.push(...pageResults);

      Logger.info(
        `Search results - Projects: ${projectResults.length}, Sections: ${sectionResults.length}, Pages: ${pageResults.length}`,
        "SearchService.searchAll"
      );
      console.log(
        `[DEBUG] SearchService.searchAll - Total results before sorting: ${results.length}`
      );

      // Sort results by relevance (can be enhanced with ranking)
      const sortedResults = results
        .sort((a, b) => {
          // Prioritize exact matches in title/name
          const aExactMatch =
            a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.name?.toLowerCase().includes(searchTerm.toLowerCase());
          const bExactMatch =
            b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.name?.toLowerCase().includes(searchTerm.toLowerCase());

          if (aExactMatch && !bExactMatch) return -1;
          if (!aExactMatch && bExactMatch) return 1;

          // Then by type priority (projects > sections > pages)
          const typePriority = { project: 1, section: 2, page: 3 };
          return typePriority[a.type] - typePriority[b.type];
        })
        .slice(0, limit);

      return sortedResults;
    } catch (error) {
      Logger.error(error.message, "SearchService.searchAll failed");
      return [];
    }
  }

  /**
   * Search in projects table
   * @param {string} searchTerm - Search term
   * @param {string} workspaceId - Workspace ID
   * @returns {Promise<Array>} Project search results
   */
  static async searchProjects(searchTerm, workspaceId) {
    try {
      Logger.info(
        `Searching projects for: "${searchTerm}" in workspace: ${workspaceId}`,
        "SearchService.searchProjects"
      );

      // Try full-text search first, fallback to simple LIKE search
      let projects;
      try {
        // Escape special characters and prepare search term for PostgreSQL full-text search
        const escapedSearchTerm = searchTerm.replace(/[!&|():*]/g, " ");
        const prefixSearchTerm = escapedSearchTerm.trim() + ":*";

        console.log(
          `[DEBUG] SearchService.searchProjects - Original: "${searchTerm}", Escaped: "${escapedSearchTerm}", Prefix: "${prefixSearchTerm}"`
        );

        projects = await prisma.$queryRaw`
          SELECT
            id,
            name,
            description,
            slug,
            ts_rank(
              to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, '')),
              to_tsquery('english', ${prefixSearchTerm})
            ) as rank
          FROM "Project"
          WHERE
            "workspaceId" = ${workspaceId}
            AND (
              to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, ''))
              @@ to_tsquery('english', ${prefixSearchTerm})
              OR name ILIKE ${`%${searchTerm}%`}
              OR description ILIKE ${`%${searchTerm}%`}
            )
          ORDER BY rank DESC, name ASC
          LIMIT 10
        `;
      } catch (fullTextError) {
        Logger.warn(
          `Full-text search failed, falling back to LIKE search: ${fullTextError.message}`,
          "SearchService.searchProjects"
        );

        // Fallback to simple LIKE search
        projects = await prisma.$queryRaw`
          SELECT
            id,
            name,
            description,
            slug,
            1.0 as rank
          FROM "Project"
          WHERE
            "workspaceId" = ${workspaceId}
            AND (
              name ILIKE ${`%${searchTerm}%`}
              OR description ILIKE ${`%${searchTerm}%`}
            )
          ORDER BY name ASC
          LIMIT 10
        `;
      }

      Logger.info(`Found ${projects.length} projects`, "SearchService.searchProjects");
      console.log(
        `[DEBUG] SearchService.searchProjects - Found ${projects.length} projects for "${searchTerm}":`,
        projects.map((p) => ({ id: p.id, name: p.name, description: p.description }))
      );

      return projects.map((project) => ({
        id: project.id,
        type: "project",
        title: project.name,
        description: project.description,
        slug: project.slug,
        matchedText: this.extractMatchedText(
          `${project.name} ${project.description || ""}`,
          searchTerm
        ),
        route: "/projects",
        metadata: {
          projectId: project.id,
          projectSlug: project.slug,
          projectName: project.name,
        },
      }));
    } catch (error) {
      Logger.error(error.message, "SearchService.searchProjects failed");
      return [];
    }
  }

  /**
   * Search in sections table
   * @param {string} searchTerm - Search term
   * @param {string} workspaceId - Workspace ID
   * @returns {Promise<Array>} Section search results
   */
  static async searchSections(searchTerm, workspaceId) {
    try {
      const sections = await prisma.$queryRaw`
        SELECT 
          s.id,
          s.name,
          s.description,
          s."projectId",
          p.name as "projectName",
          p.slug as "projectSlug",
          ts_rank(
            to_tsvector('english', COALESCE(s.name, '') || ' ' || COALESCE(s.description, '')),
            to_tsquery('english', ${searchTerm + ":*"})
          ) as rank
        FROM "Section" s
        JOIN "Project" p ON s."projectId" = p.id
        WHERE 
          p."workspaceId" = ${workspaceId}
          AND (
            to_tsvector('english', COALESCE(s.name, '') || ' ' || COALESCE(s.description, ''))
            @@ to_tsquery('english', ${searchTerm + ":*"})
            OR s.name ILIKE ${`%${searchTerm}%`}
            OR s.description ILIKE ${`%${searchTerm}%`}
          )
        ORDER BY rank DESC, s.name ASC
        LIMIT 10
      `;

      return sections.map((section) => ({
        id: section.id,
        type: "section",
        title: section.name,
        description: section.description,
        matchedText: this.extractMatchedText(
          `${section.name} ${section.description || ""}`,
          searchTerm
        ),
        route: `/projects/${section.projectSlug}/editor`,
        metadata: {
          projectId: section.projectId,
          projectSlug: section.projectSlug,
          projectName: section.projectName,
          sectionId: section.id,
          sectionName: section.name,
        },
      }));
    } catch (error) {
      Logger.error(error.message, "SearchService.searchSections failed");
      return [];
    }
  }

  /**
   * Search in pages table including content
   * @param {string} searchTerm - Search term
   * @param {string} workspaceId - Workspace ID
   * @returns {Promise<Array>} Page search results
   */
  static async searchPages(searchTerm, workspaceId) {
    try {
      const pages = await prisma.$queryRaw`
        SELECT 
          pg.id,
          pg.title,
          pg.description,
          pg.content,
          pg."sectionId",
          s.name as "sectionName",
          s."projectId",
          p.name as "projectName",
          p.slug as "projectSlug",
          ts_rank(
            to_tsvector('english', 
              COALESCE(pg.title, '') || ' ' || 
              COALESCE(pg.description, '') || ' ' ||
              COALESCE(pg.content::text, '')
            ),
            to_tsquery('english', ${searchTerm + ":*"})
          ) as rank
        FROM "Page" pg
        JOIN "Section" s ON pg."sectionId" = s.id
        JOIN "Project" p ON s."projectId" = p.id
        WHERE 
          p."workspaceId" = ${workspaceId}
          AND (
            to_tsvector('english', 
              COALESCE(pg.title, '') || ' ' || 
              COALESCE(pg.description, '') || ' ' ||
              COALESCE(pg.content::text, '')
            ) @@ to_tsquery('english', ${searchTerm + ":*"})
            OR pg.title ILIKE ${`%${searchTerm}%`}
            OR pg.description ILIKE ${`%${searchTerm}%`}
            OR pg.content::text ILIKE ${`%${searchTerm}%`}
          )
        ORDER BY rank DESC, pg.title ASC
        LIMIT 15
      `;

      return pages.map((page) => {
        // Extract text content from TipTap JSON
        const textContent = this.extractTextFromTipTapContent(page.content);
        const searchableText = `${page.title} ${page.description || ""} ${textContent}`;

        return {
          id: page.id,
          type: "page",
          title: page.title,
          description: page.description,
          matchedText: this.extractMatchedText(searchableText, searchTerm),
          route: `/projects/${page.projectSlug}/editor`,
          metadata: {
            projectId: page.projectId,
            projectSlug: page.projectSlug,
            projectName: page.projectName,
            sectionId: page.sectionId,
            sectionName: page.sectionName,
            pageId: page.id,
            pageTitle: page.title,
          },
        };
      });
    } catch (error) {
      Logger.error(error.message, "SearchService.searchPages failed");
      return [];
    }
  }

  /**
   * Extract text content from TipTap JSON structure
   * @param {Object|string} content - TipTap content JSON
   * @returns {string} Plain text content
   */
  static extractTextFromTipTapContent(content) {
    if (!content) return "";

    try {
      const contentObj = typeof content === "string" ? JSON.parse(content) : content;

      const extractText = (node) => {
        if (!node) return "";

        let text = "";

        // If node has text property, add it
        if (node.text) {
          text += node.text;
        }

        // If node has content array, recursively extract from children
        if (node.content && Array.isArray(node.content)) {
          text += node.content.map(extractText).join(" ");
        }

        return text;
      };

      return extractText(contentObj).trim();
    } catch (error) {
      Logger.error(error.message, "Failed to extract text from TipTap content");
      return "";
    }
  }

  /**
   * Extract matched text with context for highlighting
   * @param {string} text - Full text to search in
   * @param {string} searchTerm - Search term to highlight
   * @param {number} contextLength - Characters of context around match
   * @returns {string} Text snippet with match context
   */
  static extractMatchedText(text, searchTerm, contextLength = 100) {
    if (!text || !searchTerm) return text || "";

    const lowerText = text.toLowerCase();
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchIndex = lowerText.indexOf(lowerSearchTerm);

    if (matchIndex === -1) {
      // If no exact match, return beginning of text
      return text.length > contextLength ? text.substring(0, contextLength) + "..." : text;
    }

    // Calculate context boundaries
    const start = Math.max(0, matchIndex - contextLength / 2);
    const end = Math.min(text.length, matchIndex + searchTerm.length + contextLength / 2);

    let snippet = text.substring(start, end);

    // Add ellipsis if we're not at the beginning/end
    if (start > 0) snippet = "..." + snippet;
    if (end < text.length) snippet = snippet + "...";

    return snippet;
  }
}
