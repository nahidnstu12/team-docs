# Link Fix Test

## Issues Fixed:

### 1. Duplicate Text Issue
- **Problem**: When creating links, text was duplicated (e.g., "hehellohello" instead of "hehello" as link)
- **Root Cause**: Both dialog and hook were creating the link, causing duplication
- **Fix**: Removed duplicate logic from dialogs, only hook handles creation/update

### 2. URL Protocol Issue  
- **Problem**: Visit link showed error "Unable to open a window with invalid URL 'https://https://www.google.com'"
- **Root Cause**: Double protocol being added during URL processing
- **Fix**: Added URL cleaning logic to remove double protocols before adding new ones

## Test Steps:

1. **Test Link Creation**:
   - Select text "hello" 
   - Create link with URL "www.google.com"
   - Expected: Only "hello" should be a link, no duplicate text

2. **Test Link Visit**:
   - Click on created link
   - Click "Visit" button
   - Expected: Should open https://www.google.com without errors

3. **Test Link Update**:
   - Edit existing link
   - Change URL to "https://github.com"
   - Expected: Link should update without duplication

## Debug Info:
- Added console.log statements to track link creation/update data
- Check browser console for debugging information
