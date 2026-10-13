# LLM resources

A small browser tool for collecting public-domain text into downloadable `.txt` or `.jsonl` files for experimentation with small language models.

## What it does

- Provides a curated starter list of public-domain texts, including Shakespeare's complete works from Project Gutenberg's *The Complete Works of William Shakespeare*.
- Lets you select multiple sources, fetch them in your browser, preview the results, and export a combined `.txt` corpus or one-record-per-source `.jsonl`.
- Supports adding a direct text URL.
- Includes source attribution in exports and shows fetch failures rather than silently pretending a download worked.

## Important hosting detail

**jsDelivr is a CDN, not a website host.** Publish this folder as a public GitHub repository or publish the package to npm, then load the JavaScript from jsDelivr. The `index.html` demo should be opened from a web host (for example GitHub Pages), or locally through a simple local web server. jsDelivr serves HTML as plain text, so don't use a jsDelivr HTML URL as the app page.

### GitHub + jsDelivr

1. Create a public GitHub repository named `llm-resources`.
2. Upload the files in this folder, including `dist/llm-resources.js`.
3. Replace `YOUR-USER` below with your GitHub username and use the `main` branch (or a tagged release):

```html
<script src="https://cdn.jsdelivr.net/gh/YOUR-USER/llm-resources@main/dist/llm-resources.js"></script>
```

The script adds the tool to an element with `id="llm-resources"` if present. If no such element exists, it creates a full-page mount point.

For stable links, tag a release and use the tag instead of `main`, for example `@1.0.0`.

### Use the demo page

Host `index.html` and `dist/llm-resources.js` together on GitHub Pages or another static host. The demo page already loads the local script.

## Sources and licensing

The starter list points to Project Gutenberg text editions. Public-domain status can vary by country, and Gutenberg's terms and header notices may apply depending on where you are. Check the source page and preserve attribution before redistributing a corpus or using it commercially. This tool does not claim every text on the internet is public domain.

The source list includes Shakespeare plus classic works by Jane Austen, Mary Shelley, Charles Dickens, Herman Melville, Mark Twain, Lewis Carroll, and others. Text availability and cross-origin browser access can change; a source may fail to load due to network or CORS restrictions. If that happens, use a source URL that allows browser access or download the text yourself and use a local corpus workflow.

## Privacy

All fetching, previewing, and export happen in the user's browser. This package has no analytics, tracking, or server component.

## License

MIT for this tool's code. The texts remain under their own source terms.
