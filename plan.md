Build a personal portfolio and writing website using Astro.

Goal:
Create a clean, minimal, content-first developer website. This is not a flashy portfolio or web app. It should feel calm, technical, readable, mobile-friendly, and easy to extend over time.

Core design:
Use the same layout on both desktop and mobile.

Structure:
```text
-----------------------------------
| Brian Oh                        |
| Home  Projects  Writing         |
-----------------------------------
| Content                         |
-----------------------------------
```

Requirements:
- Use Astro
- Use file-based routing
- Use a minimal styling approach
- Keep the design simple and readable
- No sidebar
- No hamburger menu
- No fancy gradients, glassmorphism, or heavy animation
- Strong typography
- Comfortable whitespace
- Professional and understated look
- Content-first design
- Easy to add more projects and writing later

Pages and routes:
- /                  -> Home page
- /projects          -> Projects list page
- /projects/[slug]   -> Project detail page
- /writing           -> Writing list page
- /writing/[slug]    -> Writing detail page

Navigation:
- The top section stays consistent across all pages
- First row: site title "Brian Oh"
- Second row: navigation links "Home", "Projects", "Writing"
- Highlight the active page clearly but subtly
- Use the same navigation model on desktop and mobile

Main purpose:
1. Introduce the person
2. Show technical projects
3. Show writing/articles
4. Let users click into detail pages for projects and writing

Site style:
- Minimal
- Mobile friendly
- Clean technical blog feel
- Similar in spirit to a simple engineering blog
- Avoid startup landing page style
- Avoid visual clutter

Layout details:
- Compact top header
- Content centered with readable max width
- Good spacing between sections
- No oversized hero section
- Pages should scale naturally as more content is added

Use Astro content collections or a similarly clean content structure for:
- projects
- writing

Content model:

Projects should support:
- slug
- title
- summary
- problem
- whatIBuilt
- designDecisions
- impact
- stack
- featured (optional)

Writing should support:
- slug
- title
- date
- summary
- content/body
- featured (optional)

Recommended structure:
src/
  components/
    Layout.astro
    Navbar.astro
    PageContainer.astro
    ProjectPreview.astro
    WritingPreview.astro
  pages/
    index.astro
    projects/
      index.astro
      [slug].astro
    writing/
      index.astro
      [slug].astro
  content/
    projects/
    writing/
  styles/
    global.css

Page requirements:

1. Home page
Purpose:
A concise overview page.

Include:
- short intro / identity statement
- brief current focus
- featured projects section
- latest writing section

Tone:
Backend engineer focused on distributed systems, GraphQL, developer tooling, workflow systems, and technical writing.

2. Projects list page
Purpose:
Show a clean, scannable list of projects.

Each project preview should include:
- title
- short summary
- optional tags / stack
- clickable link to detail page

3. Project detail page
Purpose:
Show deeper technical detail using a reusable structure:
- Title
- Summary
- Problem
- What I built
- Key design decisions
- Impact
- Stack

The page should read like a compact engineering case study.

4. Writing list page
Purpose:
Show article previews in a clean list.

Each writing preview should include:
- title
- date
- short summary
- clickable link to detail page

5. Writing detail page
Purpose:
Render a readable long-form article page.

Should support:
- title
- date
- body content
- clean typography for reading

Seed placeholder content using this profile:

Name:
Brian Oh

Identity:
Backend engineer focused on distributed systems, GraphQL, developer tooling, and workflow design.

Seed projects:
1. GraphQL Query Validator
2. AI Schema Review Workflow System
3. Subgraph Debugging Context Tool

Seed writing:
1. From Video Automation to Prompt Lab
2. Thoughts on Workflow Design
3. Building Better Internal Developer Tools

Implementation notes:
- Use Astro file-based routing
- Use reusable layout and preview components
- Keep code simple and maintainable
- Separate content from layout
- Make it easy to add new projects and writing entries later
- Prefer content collections or markdown content files
- Keep dependencies minimal
- Produce a runnable project
- Do not overengineer

Suggested implementation order:
1. Create project structure
2. Add global layout and navbar
3. Set up routes
4. Add content collections or markdown content
5. Build Home, Projects, and Writing pages
6. Build detail pages
7. Add minimal polished styling
8. Seed with placeholder content

The final result should feel like a clean personal technical website that can grow over time.