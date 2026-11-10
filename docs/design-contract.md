# Portfolio interface contract

Reference: the supplied RESEARCH_PORTFOLIO_SPEC_V1_2.md, sections 1, 4, 5, 7 and 9.

The interface helps principal investigators and hiring committees understand the candidate's current status, research themes, methods, record and contact path within one minute. Primary actions are Explore research, View publications and email contact. Download CV appears only after a public-safe file is approved and supplied.

Direction, revised 10 November 2026 following the user's UI/UX request: a contemporary, luxurious scholarly folio. Warm ivory, deep forest, pale sage and restrained brass; Newsreader serif headings with DM Sans body text, served locally. The earlier render had consistently small labels, square surfaces and uniform section contrast. This revision uses larger readable metadata, a floating rounded navigation surface, pill actions, an arch-shaped lettermark folio and a dark research chapter to establish a richer hierarchy. The monogram is a decorative personal mark, not a scientific diagram, portrait or institutional seal. A typography-only hero remains intentional while an approved portrait is unavailable. No new dependencies or remote media are needed.

Checkable visual constraints: at 1440px the hero is two columns with the identity as the primary visual and a 400–440px folio; below 700px the content stacks and the dissertation milestone precedes the folio. Regular reading text is 15–17px; navigation and controls are 12–14px; secondary labels in main content are no smaller than 10px at the 390px mobile target. Dark research and contact sections use warm light text, with the publication list returning to an airy light background. Interactive pills have 44px-or-larger hit targets, explicit hover/press/focus states, tabular filter counts and motion that turns off under reduced motion. The current section is indicated in navigation through aria-current=location.

Hierarchy: identity and Ph.D. Candidate status → anticipated dissertation defense → research focus → publications → methods → academic journey → awards → contact. Navigation remains available when scrolling. Main content uses an ordinary document flow and accessible landmarks.

Target viewports: 1440x900 desktop, 768x1024 tablet, 390x844 mobile. Additional narrow stress check: 320x812. Mobile uses a disclosure menu with Escape dismissal and hash navigation. It must work with keyboard focus and reduced motion. With JavaScript disabled, the navigation stays visible and email links remain usable.

Content states:
- Loading: not applicable to prerendered content; local fonts use fallback text immediately.
- Empty: no verified publication records → an honest bibliography placeholder; no portrait → typographic focus panel; no approved CV or LinkedIn → omit the link.
- Error: clipboard denial → visible fallback directing the reader to select the email address or use the mail link.
- Partial: draft preview displays CV citations as explicitly unverified, without unverified contribution claims or links; missing institutional identities are omitted from research experience.
- Success: anchor navigation reaches its section; successful copy announces confirmation; mail contact uses mailto.
- Permission: site has no login, account or persistent permissions. Optional clipboard access is an explicit user action and has a failure fallback.

Publication safety is a release constraint. Default builds are non-indexable editorial previews. Release builds must check content approval and canonical publication metadata; incomplete public links cannot be made active by changing only a URL. No CV source PDF is copied to public assets. Browser output must not contain the private source JSON.
