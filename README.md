HTML Banner Editor
This project is a dynamic web-based tool that allows users to create and customize HTML banners with a visual drag-and-drop interface, real-time styling controls, and the ability to export the final design as an image.

Features
Customizable Banner Dimensions: Set the width and height of the banner using number inputs and sliders.

Border Radius Control: Adjust the roundness of the banner's corners.

Dynamic Background: Upload an image or GIF to serve as the banner's background, with controls for its position (X and Y).

Drag & Drop HTML Blocks:

Drag predefined HTML elements (Paragraph, Heading, List, Image) from a sidebar onto the banner.

Elements snap to the drop position.

Individual controls for each added element:

Position (X, Y): Manually adjust coordinates.

Content Editing: Edit text content for paragraphs/headings, or HTML for lists.

Font Size: Control font size with a number input and slider.

Text Color: Change the color of text elements using a color picker.

Text Formatting: Toggle Bold and Italic styles.

Image Resizing: Adjust width and height of image elements (supports px, auto, %).

Image Source: Change the image source by uploading a new file.

Lock/Unlock: Prevent elements from being dragged or edited visually on the banner.

Remove: Delete elements from the banner.

HTML Content Editor: A raw HTML textarea allows for manual editing of the banner's content. (Note: Direct manual HTML edits may interfere with the drag-and-drop system's precise positioning for elements added via blocks).

Image Export: Generate a high-quality PNG image of the customized banner using html2canvas.

Image Preview Controls:

Show/Hide the generated image.

Minimize/Restore the generated image preview.

Download the generated image.

Fixed Sidebar Menu: A sticky left-hand menu for easy access to all controls.

Tabbed Interface: Organize settings into "Design," "HTML Content," and "HTML Blocks" tabs.

Accordion Sections: Collapse and expand sections within the "Design" tab for better organization.

GitHub Link: A fixed button in the bottom-left corner linking to the project creator's GitHub profile.

Technologies Used
HTML5: For the basic structure and content.

CSS3: For styling, layout (Flexbox, positioning), responsiveness, and visual effects.

JavaScript (ES6+): For all interactive functionalities, DOM manipulation, state management, and drag-and-drop logic.

html2canvas library: A powerful JavaScript library used to convert HTML elements into a canvas image, enabling the banner export feature.

AI Assistance
This project has significantly benefited from AI assistance throughout its development. AI was instrumental in:

Refactoring Code: Helping to restructure and optimize JavaScript logic for better readability and maintainability.

Implementing Complex Features: Guiding the implementation of advanced functionalities like the drag-and-drop system with individual element controls, and the dynamic styling.

Styling Enhancements: Providing suggestions and generating CSS snippets for various UI components, ensuring a clean and modern aesthetic.

Debugging: Assisting in identifying and resolving various bugs and inconsistencies that arose during development.

How to Use
Follow these steps to set up and run the HTML Banner Editor on your local machine:

Prerequisites
A modern web browser (e.g., Chrome, Firefox, Edge, Safari).

Setup
Create Project Files: In a new folder on your computer, create three empty files:

index.html

style.css

script.js

GitHub Icon: Download a simple GitHub icon in SVG format (e.g., github-mark.svg) and place it in the same folder as your index.html file. You can use this link directly in the HTML: https://creazilla-store.fra1.digitaloceanspaces.com/icons/7912097/git-icon-md.png

Copy Code:

Copy the HTML code provided below and paste it into index.html.

Copy the CSS code provided below and paste it into style.css.

Copy the JavaScript code provided below and paste it into script.js.

Running the Project
Open index.html: Simply double-click the index.html file in your file explorer. It will open in your default web browser.

Brief Tutorial
Banner Size (Design Tab):

Use the "Largura (px)" (Width) and "Altura (px)" (Height) number inputs or sliders to adjust the main banner's size.

Borders (Design Tab):

Adjust the "Borda Arredondada (px)" (Border Radius) slider to round the banner's corners.

Background (Design Tab):

Click "Fundo (Imagem/GIF)" to upload an image from your computer.

Use "Posição X do Fundo" and "Posição Y do Fundo" sliders/inputs to adjust the background image's position.

HTML Blocks (HTML Blocks Tab):

Drag & Drop: Click and drag a "Parágrafo," "Título," "Lista," or "Imagem" block from the "Arraste e Solte Blocos no Banner" section onto the blue banner.

Repositioning: Once on the banner, you can click and drag the element again to reposition it.

Individual Controls: Below the draggable blocks, a "Elementos Adicionados" (Added Elements) section will appear. Each added element will have its own set of controls:

Pos X / Pos Y: Adjust the element's position manually.

Conteúdo / Tamanho Fonte / Cor: Edit text, font size (number/slider), and color for text/heading/list blocks.

Trocar Imagem / Largura / Altura: Change the image source and resize image blocks.

Lock/Unlock (🔒/🔓): Click the padlock icon to lock an element, preventing it from being dragged on the banner. Click again to unlock.

Remove (❌): Click the cross icon to delete an element.

HTML Content (HTML Content Tab):

The textarea in this tab will display the generated HTML from your dragged blocks. You can edit it directly, but be aware that manual edits might affect the drag-and-drop system's ability to precisely control elements.

Generate Image:

Click the "Gerar Imagem" button to create a PNG image of your banner. The image will appear below the buttons.

Image Preview Controls:

"Esconder Imagem" / "Mostrar Imagem": Toggles the visibility of the generated image.

"Minimizar Imagem" / "Restaurar Imagem": Shrinks the image preview to a thumbnail or restores it to full size.

"Baixar Imagem": Downloads the generated PNG file.

GitHub Button:

Click the GitHub icon in the bottom-left corner to visit the creator's GitHub profile.

Enjoy creating your custom banners!
