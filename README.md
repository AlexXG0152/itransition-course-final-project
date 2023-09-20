# itransition-course-final-project-backend

Swagger API

<https://itransition-course-final-project-back.onrender.com/api/v1/docs>

User with admin rights
user2@user.com
123456789

Web portal for reviews "what should you read/watch/play/work, etc."

SITE FOR MANAGING RECOMMENDATIONS “WHAT TO WATCH/WHAT TO READ/WHAT TO PLAY/WHOM TO WORK WITH, ETC.”

FRONTEND: TypeScript/JavaScript, Angular, Bootstrap.
BACKEND: Node.js, NestJS, MySQL.

For unauthenticated users, only read-only mode is available (search is available, creation of reviews is not available, comments, likes and ratings are not allowed).

Authenticated users have access to everything except the admin area. In the basic version, the admin panel is a list of users (as links to their pages).

It is required to support authentication through social networks (at least two of any kind).

The administrator sees each user page and each “review” as its creator (for example, he can edit or create a new “review” from his page on behalf of the user).

On each page, a full-text search on the site is available (the search results are always reviews, for example, if the text is found in a comment, which should be possible, then a link to the review is displayed).

Each user has his personal page, on which he sees a list of his reviews (a table with filtering and sorting, the ability to create/delete/edit a review/open in view mode).

Each review consists of: title of the review, title of the work (see also requirements with \*), “group” (from a fixed set, for example, “Movies”, “Books”, “Games”, etc.), tags ( several tags are entered, auto-completion is necessary - when the user starts entering a tag, a list appears with options for words that have already been entered previously on the site), review text (with support for markdown formatting), an optional illustration image (stored in the cloud) and ratings from the author 10-b. scale.

All images are saved in the cloud and loaded via drag-and-drop.

The main page displays: the most recently added reviews, reviews with the highest ratings, and a tag cloud.

Each user can give a “rating” (1..5 stars) to a product (no more than one from one user per review) - the average user rating is displayed next to the review title everywhere on the site.

The user can also like the review itself (no more than 1 per review from 1 user), these likes are added up across all the user’s reviews and are displayed next to the user’s name.

If two users describe the same movie, it is not related in any way (see requirements with an asterisk).

Comments are displayed at the end under the review in view mode (or by other users). Comments are linear, you cannot comment on a comment, a new one is added only “at the tail”. Automatic loading of comments - if I have a page with comments open and someone else adds a new one, it automatically appears (there may be a delay of 2-5 seconds).

The site must support at least two UI languages: English and another (Polish, Russian, Georgian, Uzbek, etc.) (the user selects and the choice is saved). Content, reviews and comments are not translated. The site must support two designs (themes): light and dark (the user selects and the choice is saved).

Required: Bootstrap (or any other CSS framework), support for different resolutions (including phone), ORM/ODM for accessing data, an engine for full-text search (either using a database, or a separate engine - NOT FULL SCAN by selectors).

Requirements with an asterisk (optional only, 10/10, after other requirements are implemented):

- Advanced admin panel, which allows you to manage users (view, block, delete, assign others as admins).

- Ability to upload an arbitrary number of illustrations for review and support for a gallery for viewing.

- Export reviews with pictures to PDF.

- The ability to “link” different reviews of one work from different users (show links from one to the others) and calculate the average rating. To do this, use a separate entity “work” and associate reviews with the work (when creating a review, either select an existing work or create a new one).

You must use ready-made components, libraries, controls. For example, a control for markdown rendering or for loading an image using drag-n-drop or tag cloud rendering, etc.
