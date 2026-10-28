import "./introduction.css";

export default { title: "Start here/Runway UI" };
export const Welcome = {
  render: () => `
    <main class="library-home">
      <header class="library-home__masthead">
        <span class="library-home__wordmark"><span class="rw-icon" data-icon="cube" aria-hidden="true"></span> Runway UI</span>
        <span class="rw-badge">HTML + CSS · MIT licensed</span>
      </header>
      <section class="library-home__hero" aria-labelledby="library-title">
        <div>
          <p class="rw-kicker">A little character. A whole system.</p>
          <h1 id="library-title">Build worlds.<br>Make them feel <em>alive.</em></h1>
          <p class="library-home__intro">Tactile controls, thoughtful details, and room for your world. A framework-independent UI library for management and simulation games.</p>
          <nav class="story-samples" aria-label="Explore the library">
            <a class="rw-button" data-variant="primary" href="./?path=/story/foundations-controls--button" target="_top">Explore components <span aria-hidden="true">→</span></a>
            <a class="rw-button" data-variant="secondary" href="./?path=/story/compositions-desk-workspace--playground" target="_top">See a workspace</a>
          </nav>
          <p class="library-home__note">Zero runtime dependencies. Your markup. Your theme.</p>
        </div>
        <section class="rw-panel library-home__specimen" aria-labelledby="specimen-title">
          <header class="rw-panel__header"><p class="rw-kicker">Your next adventure</p><span class="rw-badge">Ready</span></header>
          <h2 id="specimen-title">A world taking shape.</h2>
          <p class="rw-muted">Small pieces. Endless possibilities.</p>
          <div class="library-home__resources">
            <div class="rw-resource"><span class="rw-resource__icon" aria-hidden="true">◈</span><div><strong>2,840</strong><small>Credits in reserve</small></div></div>
            <div class="rw-resource"><span class="rw-resource__icon rw-icon" data-icon="arrow-up-right" aria-hidden="true"></span><div><strong>+18%</strong><small>Production growth</small></div></div>
          </div>
          <ul class="rw-objectives"><li data-complete="true"><span aria-label="Complete">✓</span><span>Establish your outpost</span></li><li><span aria-hidden="true">○</span><span>Prepare the next expedition</span></li></ul>
          <div class="library-home__specimen-footer"><span class="rw-muted">Everything you need to begin.</span><a class="rw-button" data-variant="primary" href="./?path=/story/game-patterns-systems--objectives" target="_top">Discover <span class="rw-icon" data-icon="arrow-up-right" aria-hidden="true"></span></a></div>
        </section>
      </section>
      <nav class="library-home__catalog" aria-label="Component collections">
        <a class="rw-panel" href="./?path=/story/foundations-controls--button" target="_top"><span class="rw-kicker">01 / Foundations</span><h2>Start with the details <span class="rw-icon" data-icon="arrow-up-right" aria-hidden="true"></span></h2><p>Buttons, fields, surfaces and native dialogs. Familiar interactions with a little personality.</p><span class="library-home__pills"><span>Controls</span><span>Forms</span><span>Tokens</span></span></a>
        <a class="rw-panel" href="./?path=/story/game-patterns-systems--objectives" target="_top"><span class="rw-kicker">02 / Game patterns</span><h2>Give systems a home <span class="rw-icon" data-icon="arrow-up-right" aria-hidden="true"></span></h2><p>Resources, objectives and action docks. Modular pieces that work beautifully together.</p><span class="library-home__pills"><span>Inventory</span><span>Resources</span><span>Navigation</span></span></a>
        <a class="rw-panel" href="./?path=/story/charts-css-plots--columns" target="_top"><span class="rw-kicker">03 / Data & insights</span><h2>Make every number count <span class="rw-icon" data-icon="arrow-up-right" aria-hidden="true"></span></h2><p>Readable charts and instruments with real labels, explicit scales and exact-data tables.</p><span class="library-home__pills"><span>Charts</span><span>History</span><span>Instruments</span></span></a>
      </nav>
      <section class="library-home__guide" aria-labelledby="explorer-guide">
        <header><p class="rw-kicker">From curiosity to your first screen</p><h2 id="explorer-guide">Take a little tour.</h2><p class="rw-muted">Everything here is real markup. Every example is yours to take apart.</p></header>
        <ol class="library-home__steps">
          <li><span aria-hidden="true">01</span><div><h3>Pick a recipe</h3><p>Start with a small, working panel. Copy its HTML and the stylesheet it needs.</p><a href="./?path=/story/start-here-recipe-book--playground" target="_top">Open the recipe book →</a></div></li>
          <li><span aria-hidden="true">02</span><div><h3>Make it your world</h3><p>Change theme, material, density and depth in the toolbar. The markup stays the same.</p><a href="./?path=/story/start-here-theme-playground--playground" target="_top">Try the theme playground →</a></div></li>
          <li><span aria-hidden="true">03</span><div><h3>Keep the good details</h3><p>Read the notes, inspect the Code panel, and check states and accessibility before you ship.</p><a href="../docs/README.html" target="_top">Find the right guide →</a></div></li>
        </ol>
      </section>
      <footer class="library-home__footer"><span>One vocabulary. Six themes. Plenty of possibility.</span><span>Change theme, density and depth in the toolbar above.</span></footer>
    </main>`,
};
