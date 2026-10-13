(function () {
  "use strict";

  const SOURCES = [
    { id:"shakespeare", title:"The Complete Works of William Shakespeare", author:"William Shakespeare", category:"Drama & poetry", url:"https://www.gutenberg.org/cache/epub/100/pg100.txt", note:"Complete-works edition; large download" },
    { id:"pride-prejudice", title:"Pride and Prejudice", author:"Jane Austen", category:"Novel", url:"https://www.gutenberg.org/cache/epub/1342/pg1342.txt" },
    { id:"frankenstein", title:"Frankenstein", author:"Mary Wollstonecraft Shelley", category:"Novel", url:"https://www.gutenberg.org/cache/epub/84/pg84.txt" },
    { id:"alice", title:"Alice's Adventures in Wonderland", author:"Lewis Carroll", category:"Novel", url:"https://www.gutenberg.org/cache/epub/11/pg11.txt" },
    { id:"moby-dick", title:"Moby-Dick; or, The Whale", author:"Herman Melville", category:"Novel", url:"https://www.gutenberg.org/cache/epub/2701/pg2701.txt" },
    { id:"dorian-gray", title:"The Picture of Dorian Gray", author:"Oscar Wilde", category:"Novel", url:"https://www.gutenberg.org/cache/epub/174/pg174.txt" },
    { id:"sherlock", title:"The Adventures of Sherlock Holmes", author:"Arthur Conan Doyle", category:"Short stories", url:"https://www.gutenberg.org/cache/epub/1661/pg1661.txt" },
    { id:"dracula", title:"Dracula", author:"Bram Stoker", category:"Novel", url:"https://www.gutenberg.org/cache/epub/345/pg345.txt" },
    { id:"great-expectations", title:"Great Expectations", author:"Charles Dickens", category:"Novel", url:"https://www.gutenberg.org/cache/epub/1400/pg1400.txt" },
    { id:"tom-sawyer", title:"The Adventures of Tom Sawyer", author:"Mark Twain", category:"Novel", url:"https://www.gutenberg.org/cache/epub/74/pg74.txt" },
    { id:"jane-eyre", title:"Jane Eyre", author:"Charlotte Brontë", category:"Novel", url:"https://www.gutenberg.org/cache/epub/1260/pg1260.txt" },
    { id:"wuthering-heights", title:"Wuthering Heights", author:"Emily Brontë", category:"Novel", url:"https://www.gutenberg.org/cache/epub/768/pg768.txt" },
    { id:"little-women", title:"Little Women", author:"Louisa May Alcott", category:"Novel", url:"https://www.gutenberg.org/cache/epub/514/pg514.txt" },
    { id:"republic", title:"The Republic", author:"Plato", category:"Philosophy", url:"https://www.gutenberg.org/cache/epub/1497/pg1497.txt" },
    { id:"meditations", title:"Meditations", author:"Marcus Aurelius", category:"Philosophy", url:"https://www.gutenberg.org/cache/epub/2680/pg2680.txt" },
    { id:"grimms", title:"Grimms' Fairy Tales", author:"Jacob and Wilhelm Grimm", category:"Folktales", url:"https://www.gutenberg.org/cache/epub/2591/pg2591.txt" },
    { id:"aesop", title:"Aesop's Fables", author:"Aesop", category:"Fables", url:"https://www.gutenberg.org/cache/epub/11339/pg11339.txt" },
    { id:"yellow-wallpaper", title:"The Yellow Wallpaper", author:"Charlotte Perkins Gilman", category:"Short story", url:"https://www.gutenberg.org/cache/epub/1952/pg1952.txt" },
    { id:"call-wild", title:"The Call of the Wild", author:"Jack London", category:"Novel", url:"https://www.gutenberg.org/cache/epub/215/pg215.txt" },
    { id:"peter-pan", title:"Peter Pan", author:"J. M. Barrie", category:"Novel", url:"https://www.gutenberg.org/cache/epub/16/pg16.txt" }
  ];

  const cssUrl = (document.currentScript && document.currentScript.src)
    ? new URL("llm-resources.css", document.currentScript.src).href : "";
  if (cssUrl && !document.querySelector('link[data-llmr-style]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = cssUrl; link.dataset.llmrStyle = "1";
    document.head.appendChild(link);
  }

  function mount() {
    let host = document.getElementById("llm-resources");
    if (!host) {
      host = document.createElement("div");
      host.id = "llm-resources";
      document.body.appendChild(host);
    }
    host.innerHTML = `
      <div id="llmr-app"><div class="shell">
        <div class="top"><div><span class="tag">Public-domain text collector</span><h1>LLM resources</h1>
        <p>Build a text corpus for small-model experiments. Choose sources, fetch them, inspect the text, then export a training file.</p></div>
        <span class="tag">Browser-only · no account</span></div>
        <div class="layout">
          <section class="panel">
            <h2>1. Choose texts</h2>
            <div class="toolbar">
              <button id="llmr-all" class="secondary">Select all</button>
              <button id="llmr-none" class="secondary">Clear</button>
              <button id="llmr-fetch">Fetch selected</button>
            </div>
            <div class="source-list" id="llmr-sources"></div>
            <label class="field" for="llmr-url">Add a direct text URL</label>
            <div class="urlrow"><input id="llmr-url" type="url" placeholder="https://example.org/book.txt"><button id="llmr-add" class="secondary">Add</button></div>
            <div class="notice">Only use texts you have the right to download and use. Browser fetches may be blocked by a source's CORS policy; if so, try another direct-text source or a local corpus workflow.</div>
            <div class="meter"><span id="llmr-progress"></span></div>
            <div class="status" id="llmr-status" role="status">Ready. Select one or more sources to begin.</div>
          </section>
          <section class="panel">
            <h2>2. Review & export</h2>
            <div class="stats">
              <div class="stat"><b id="llmr-count">0</b><span>loaded texts</span></div>
              <div class="stat"><b id="llmr-words">0</b><span>approx. words</span></div>
              <div class="stat"><b id="llmr-size">0 KB</b><span>text size</span></div>
            </div>
            <label class="field" for="llmr-format">Export format</label>
            <select id="llmr-format"><option value="txt">Combined .txt</option><option value="jsonl">JSONL (one text per line)</option></select>
            <div class="toolbar" style="margin-top:10px">
              <button id="llmr-export" disabled>Download corpus</button>
              <button id="llmr-preview" class="secondary" disabled>Refresh preview</button>
            </div>
            <textarea id="llmr-preview-text" spellcheck="false" placeholder="Fetched text will appear here. Large corpora may make this preview slow."></textarea>
            <div class="foot">JSONL fields: <code>title</code>, <code>author</code>, <code>source</code>, <code>text</code>. The exported texts retain source headers; review licensing before redistribution or commercial use.</div>
          </section>
        </div>
        <div class="foot">LLM resources · Starter catalog links to Project Gutenberg editions. The app itself does not upload your data anywhere.</div>
      </div></div>`;

    const $ = id => document.getElementById(id);
    const sources = SOURCES.map(x => ({...x, custom:false}));
    const loaded = new Map();
    const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    function renderSources() {
      $("llmr-sources").innerHTML = sources.map(s => `
        <label class="source"><input type="checkbox" data-source="${esc(s.id)}" ${s.id==="shakespeare" ? "checked" : ""}>
        <span><strong>${esc(s.title)}</strong><small>${esc(s.author)} · ${esc(s.category || "Custom text")}<br>${esc(s.url)}</small></span></label>`).join("");
    }
    function selected() {
      return [...$("llmr-sources").querySelectorAll("input:checked")].map(el => sources.find(s => s.id === el.dataset.source)).filter(Boolean);
    }
    function wordCount(s) { return (s.match(/\b[\p{L}\p{N}'’-]+\b/gu) || []).length; }
    function humanBytes(n) { return n < 1024 ? n + " B" : n < 1024*1024 ? (n/1024).toFixed(1)+" KB" : (n/1024/1024).toFixed(2)+" MB"; }
    function updateStats() {
      const arr = [...loaded.values()];
      const bytes = arr.reduce((n,x)=>n+x.text.length,0);
      $("llmr-count").textContent = arr.length;
      $("llmr-words").textContent = arr.reduce((n,x)=>n+wordCount(x.text),0).toLocaleString();
      $("llmr-size").textContent = humanBytes(bytes);
      $("llmr-export").disabled = arr.length === 0;
      $("llmr-preview").disabled = arr.length === 0;
      $("llmr-preview-text").value = arr.map(x => `===== ${x.title} — ${x.author} =====\nSource: ${x.source}\n\n${x.text}`).join("\n\n\n").slice(0, 180000);
    }
    async function fetchSelected() {
      const list = selected();
      if (!list.length) { $("llmr-status").textContent = "Select at least one source."; return; }
      $("llmr-fetch").disabled = true;
      let success = 0, errors = [];
      for (let i=0; i<list.length; i++) {
        const s = list[i];
        $("llmr-status").textContent = `Fetching ${i+1}/${list.length}: ${s.title}`;
        $("llmr-progress").style.width = `${Math.round((i/list.length)*100)}%`;
        try {
          const response = await fetch(s.url, {mode:"cors", redirect:"follow"});
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const text = (await response.text()).replace(/\r\n/g,"\n").trim();
          if (!text || text.length < 100) throw new Error("The response was empty or unexpectedly short.");
          loaded.set(s.id, {title:s.title, author:s.author || "Unknown", source:s.url, text});
          success++;
        } catch (err) {
          errors.push(`${s.title}: ${err.message || "Could not fetch this source"}`);
        }
        updateStats();
      }
      $("llmr-progress").style.width = "100%";
      $("llmr-status").textContent = `Finished: ${success} loaded, ${errors.length} failed.` + (errors.length ? "\n\n" + errors.join("\n") : "");
      $("llmr-fetch").disabled = false;
    }
    function download(name, content, type) {
      const blob = new Blob([content], {type});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href=url; a.download=name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(url), 1500);
    }
    $("llmr-all").addEventListener("click", ()=>{$("llmr-sources").querySelectorAll("input").forEach(x=>x.checked=true);});
    $("llmr-none").addEventListener("click", ()=>{$("llmr-sources").querySelectorAll("input").forEach(x=>x.checked=false);});
    $("llmr-fetch").addEventListener("click", fetchSelected);
    $("llmr-add").addEventListener("click", ()=>{
      const url = $("llmr-url").value.trim();
      try { const parsed = new URL(url); if (!/^https?:$/.test(parsed.protocol)) throw new Error(); }
      catch { $("llmr-status").textContent = "Enter a valid http(s) text URL."; return; }
      if (sources.some(s=>s.url===url)) { $("llmr-status").textContent = "That URL is already in the list."; return; }
      const id = "custom-" + Math.random().toString(36).slice(2,10);
      sources.push({id,title:parsed.pathname.split("/").pop() || "Custom text",author:"Unknown / user-added",category:"Custom text",url,custom:true});
      renderSources();
      const cb = $("llmr-sources").querySelector(`[data-source="${id}"]`); if(cb) cb.checked=true;
      $("llmr-url").value="";
    });
    $("llmr-export").addEventListener("click", ()=>{
      const arr=[...loaded.values()];
      if (!arr.length) return;
      const format=$("llmr-format").value;
      if (format==="jsonl") {
        const content=arr.map(x=>JSON.stringify({title:x.title,author:x.author,source:x.source,text:x.text})).join("\n")+"\n";
        download("llm-resources.jsonl",content,"application/x-ndjson;charset=utf-8");
      } else {
        const content=arr.map(x=>`===== ${x.title} =====\nAuthor: ${x.author}\nSource: ${x.source}\n\n${x.text}`).join("\n\n\n");
        download("llm-resources-corpus.txt",content,"text/plain;charset=utf-8");
      }
    });
    $("llmr-preview").addEventListener("click", updateStats);
    renderSources();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, {once:true});
  else mount();
  window.LLMResources = { version:"1.0.0", sources:SOURCES.slice() };
})();