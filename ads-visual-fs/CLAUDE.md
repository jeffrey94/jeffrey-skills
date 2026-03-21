# ads-visual-fs — Plugin Development Guide

## Image Generation Error Handling

All commands that call `generate-image.ts` must follow this error handling pattern:

- **Rate limit (429) or service unavailable (503):** Wait 5 seconds, retry once. If still failing, present the error to the user.
- **Content policy violation:** Present the API's rejection reason to the user and offer to modify the prompt.
- **No image data returned:** Retry once with a simplified prompt (reduce detail, keep brand constraints). If still no image, tell the user and suggest a different concept direction.
- **JSON parse error:** If the API returns a 200 but the response body is not valid JSON, treat as a transient error — retry once. If still malformed, present: "Gemini returned an unexpected response. Try again or simplify the prompt."
- **File write failure:** Present the error with the file path. Check that `ads-output/` directory exists.
- **Other failures:** Present the error message and offer to try a different prompt.

For `/resize` specifically: if one platform fails, log the error and continue with remaining platforms. Present partial results at the end.
