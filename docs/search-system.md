# 🔍 Search System Documentation

## Overview

The Team-Docs search system provides comprehensive full-text search capabilities across projects, sections, and pages within a workspace. Built with PostgreSQL's advanced search features and optimized for performance and user experience.

## Architecture

### Core Components

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   SearchButton  │───▶│  SearchDialog    │───▶│  searchAction   │
│   (Trigger)     │    │  (UI Interface)  │    │  (Server Action)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │ searchNavigation │    │  SearchService  │
                       │   (Utilities)    │    │ (Database Logic)│
                       └──────────────────┘    └─────────────────┘
```

### File Structure

```
src/app/(home)/search/
├── components/
│   ├── SearchButton.jsx      # Search trigger with keyboard shortcuts
│   └── SearchDialog.jsx      # Main search interface
├── actions/
│   └── searchAction.js       # Server actions for search operations
└── utils/
    └── searchNavigation.js   # Navigation utilities for search results

src/system/Services/
└── SearchService.js          # Core search logic and database queries
```

## Components Deep Dive

### 1. SearchButton Component

**Location**: `src/app/(home)/search/components/SearchButton.jsx`

**Purpose**: Provides the search trigger button with keyboard shortcut support.

**Key Features**:

- Keyboard shortcut support (Ctrl+K / Cmd+K)
- Responsive design (icon-only on mobile, full button on desktop)
- Integrated with SearchDialog component

**Implementation Details**:

```javascript
// Keyboard shortcut handler
useEffect(() => {
  const handleKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "k") {
      event.preventDefault();
      setIsSearchOpen(true);
    }
  };
  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, []);
```

### 2. SearchDialog Component

**Location**: `src/app/(home)/search/components/SearchDialog.jsx`

**Purpose**: Main search interface with real-time search and result display.

**Key Features**:

- Real-time search with 300ms debouncing
- Minimum 2-character validation with user feedback
- Search result highlighting with matched text
- Keyboard navigation and accessibility
- Framer Motion animations for smooth UX
- Integration with Zustand store for navigation state

**State Management**:

```javascript
const [query, setQuery] = useState(""); // Current search query
const [results, setResults] = useState([]); // Search results array
const [isSearching, startTransition] = useTransition(); // Loading state
const [error, setError] = useState(null); // Error messages
```

**Search Flow**:

1. User types in search input
2. Debounced effect triggers after 300ms
3. Validates minimum 2 characters
4. Calls `performSearch` function
5. Updates UI with results or error messages
6. User clicks result → navigation with store updates

### 3. searchAction Server Function

**Location**: `src/app/(home)/search/actions/searchAction.js`

**Purpose**: Server action that handles search requests and validation.

**Key Features**:

- Input validation and sanitization
- Session-based workspace scoping
- Error handling with user-friendly messages
- Result formatting for UI consumption

**Validation Logic**:

```javascript
// Input validation
if (!query || typeof query !== "string") {
  return { success: true, data: [], message: "Empty query" };
}

// Minimum length check
if (trimmedQuery.length < 2) {
  return { success: true, data: [], message: "Query too short" };
}
```

### 4. SearchService Class

**Location**: `src/system/Services/SearchService.js`

**Purpose**: Core search logic with PostgreSQL full-text search implementation.

**Key Features**:

- PostgreSQL full-text search with `to_tsvector()` and `to_tsquery()`
- Intelligent fallback to ILIKE pattern matching
- Workspace-scoped queries for security
- Parallel search execution across content types
- Advanced ranking and sorting algorithms

**Search Methods**:

- `searchAll()`: Master orchestration function
- `searchProjects()`: Project name and description search
- `searchSections()`: Section name and description search
- `searchPages()`: Page title, description, and content search

## Database Implementation

### PostgreSQL Full-Text Search

The system uses PostgreSQL's advanced full-text search capabilities:

```sql
-- Example project search query
SELECT
  id, name, description, slug,
  ts_rank(
    to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, '')),
    to_tsquery('english', $1)
  ) as rank
FROM "Project"
WHERE
  "workspaceId" = $2
  AND to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, ''))
      @@ to_tsquery('english', $3)
ORDER BY rank DESC, name ASC
LIMIT 10
```

### Search Strategies

1. **Primary Strategy**: Full-text search with `ts_rank()` scoring
2. **Fallback Strategy**: ILIKE pattern matching for broader compatibility
3. **Prefix Matching**: Uses `:*` suffix for partial word matches

### Performance Optimizations

- **Result Limits**: 10 projects, 10 sections, 15 pages
- **Workspace Scoping**: Prevents cross-workspace data access
- **Parameterized Queries**: SQL injection prevention
- **Efficient Indexing**: Optimized for search performance

## Search Ranking Algorithm

### Ranking Priorities

1. **Exact Title Matches**: Highest priority for user intent
2. **Content Type Priority**: Projects > Sections > Pages
3. **PostgreSQL ts_rank**: Relevance scoring based on term frequency
4. **Alphabetical Sorting**: Final tiebreaker for consistent results

### Implementation

```javascript
const sortedResults = results.sort((a, b) => {
  // Priority 1: Exact matches in title/name
  const aExactMatch =
    a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.name?.toLowerCase().includes(searchTerm.toLowerCase());
  const bExactMatch =
    b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.name?.toLowerCase().includes(searchTerm.toLowerCase());

  if (aExactMatch && !bExactMatch) return -1;
  if (!aExactMatch && bExactMatch) return 1;

  // Priority 2: Content type hierarchy
  const typePriority = { project: 1, section: 2, page: 3 };
  return typePriority[a.type] - typePriority[b.type];
});
```

## Navigation System

### Search Navigation Utilities

**Location**: `src/app/(home)/search/utils/searchNavigation.js`

**Purpose**: Handles navigation logic for search results with proper state management.

**Key Functions**:

- `navigateToSearchResult()`: Main navigation handler
- `getNavigationPreview()`: Preview text for search results
- `requiresEditorContext()`: Checks if navigation needs editor context
- `getResultBreadcrumb()`: Generates breadcrumb paths

### Navigation Logic

```javascript
export function navigateToSearchResult(result, router, projectStore) {
  const { route, metadata, type } = result;
  const { setSelectedSection, setSelectedPage } = projectStore;

  switch (type) {
    case "project":
      router.push("/projects");
      break;
    case "section":
      setSelectedSection(metadata.sectionId);
      setSelectedPage(null);
      router.push(route);
      break;
    case "page":
      setSelectedSection(metadata.sectionId);
      setSelectedPage(metadata.pageId);
      router.push(route);
      break;
  }
}
```

## Performance Considerations

### Frontend Optimizations

- **Debouncing**: 300ms delay prevents excessive API calls
- **React Concurrent Features**: useTransition for non-blocking UI updates
- **Result Limiting**: Maximum 15 results for optimal UI performance
- **Lazy Loading**: Dynamic imports for search components

### Backend Optimizations

- **Query Optimization**: Efficient PostgreSQL queries with proper indexing
- **Workspace Scoping**: Reduces search scope for better performance
- **Connection Pooling**: Prisma connection management
- **Error Handling**: Graceful fallbacks prevent system crashes

## Security Features

### Access Control

- **Workspace Isolation**: Users can only search within their workspace
- **Session Validation**: Server-side session checking
- **Parameterized Queries**: SQL injection prevention
- **Input Sanitization**: Prevents malicious input

### Data Protection

- **Scoped Queries**: Workspace-limited database queries
- **Permission Checking**: Respects user access levels
- **Audit Logging**: Search activity tracking (planned)

## Usage Examples

### Basic Search Implementation

```javascript
// Trigger search from component
const handleSearch = async (query) => {
  const results = await searchAction(query, { limit: 10 });
  if (results.success) {
    setSearchResults(results.data);
  }
};
```

### Custom Search Integration

```javascript
// Custom search with specific options
const customSearch = async (query, options = {}) => {
  const response = await searchAction(query, {
    limit: options.limit || 20,
    ...options,
  });
  return response;
};
```

## Future Enhancements

### Planned Improvements

1. **Elasticsearch Integration**: Advanced search capabilities
2. **Search Analytics**: Usage tracking and insights
3. **Saved Searches**: User-defined search shortcuts
4. **Search Filters**: Content type and date filtering
5. **Search Suggestions**: Auto-complete and query suggestions

### Technical Roadmap

- **Performance**: Search result caching
- **Features**: Advanced query syntax support
- **UX**: Search history and recent searches
- **Analytics**: Search performance monitoring

## Troubleshooting

### Common Issues

#### Search Not Working

1. **Check Database Connection**: Ensure PostgreSQL is running
2. **Verify Workspace Access**: User must be in an active workspace
3. **Check Search Permissions**: User needs read access to content
4. **Database Indexes**: Ensure proper indexes are created

#### Performance Issues

1. **Query Optimization**: Review slow query logs
2. **Result Limiting**: Reduce result limits if needed
3. **Debounce Timing**: Adjust debounce delay for better UX
4. **Connection Pooling**: Monitor database connections

#### UI Issues

1. **Component Loading**: Check dynamic imports
2. **State Management**: Verify Zustand store updates
3. **Navigation**: Ensure proper route handling
4. **Responsive Design**: Test on different screen sizes

### Debug Tools

#### Search Debugging

```javascript
// Enable search debugging
const debugSearch = async (query) => {
  console.log("Search Query:", query);
  const results = await searchAction(query, { limit: 5 });
  console.log("Search Results:", results);
  return results;
};
```

#### Performance Monitoring

```javascript
// Monitor search performance
const monitorSearch = async (query) => {
  const startTime = performance.now();
  const results = await searchAction(query);
  const endTime = performance.now();
  console.log(`Search took ${endTime - startTime} milliseconds`);
  return results;
};
```

---

_This documentation covers the current implementation of the search system. For implementation details and code examples, refer to the source files mentioned throughout this document._
