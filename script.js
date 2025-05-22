document.addEventListener('DOMContentLoaded', () => {
    const editableContainer = document.getElementById('editableContainer');

    // Elementos das Abas
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Elementos do Acordeão
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    // Elementos para Largura do Container Principal
    const containerWidthNumber = document.getElementById('containerWidthNumber');
    const containerWidthSlider = document.getElementById('containerWidthSlider');
    const containerWidthValueSpan = document.getElementById('containerWidthValue');

    // Elementos para Altura do Container Principal
    const containerHeightNumber = document.getElementById('containerHeightNumber');
    const containerHeightSlider = document.getElementById('containerHeightSlider');
    const containerHeightValueSpan = document.getElementById('containerHeightValue');

    // Elementos para Posição X do Background
    const backgroundPositionXNumber = document.getElementById('backgroundPositionXNumber');
    const backgroundPositionXSlider = document.getElementById('backgroundPositionXSlider');
    const backgroundPositionXValueSpan = document.getElementById('backgroundPositionXValue');

    // Elementos para Posição Y do Background
    const backgroundPositionYNumber = document.getElementById('backgroundPositionYNumber');
    const backgroundPositionYSlider = document.getElementById('backgroundPositionYSlider');
    const backgroundPositionYValueSpan = document.getElementById('backgroundPositionYValue');

    // Outros elementos de controle global
    const borderRadiusInput = document.getElementById('borderRadius');
    const borderRadiusValueSpan = document.getElementById('borderRadiusValue');
    const backgroundImageUpload = document.getElementById('backgroundImageUpload');
    const htmlEditor = document.getElementById('htmlEditor');
    const applyChangesBtn = document.getElementById('applyChangesBtn');
    const captureImageBtn = document.getElementById('captureImageBtn');
    const imagePreview = document.getElementById('imagePreview');
    const toggleImagePreviewBtn = document.getElementById('toggleImagePreviewBtn');
    const minimizeImagePreviewBtn = document.getElementById('minimizeImagePreviewBtn');

    // Elementos da nova aba de Blocos HTML
    const draggableBlocks = document.querySelectorAll('.draggable-block');
    const addedElementsList = document.getElementById('addedElementsList');
    const noElementsMessage = addedElementsList.querySelector('.no-elements-message');

    // Variáveis de estado global
    let currentIntendedWidth = parseInt(containerWidthNumber.value);
    let currentIntendedHeight = parseInt(containerHeightNumber.value);
    let currentBackgroundImageUrl = null;

    // Array para armazenar os blocos adicionados dinamicamente no banner
    let addedBlocks = [];
    let nextBlockId = 0; // Para gerar IDs únicos para novos blocos

    // Variáveis para arrastar e soltar elementos já no banner
    let currentDraggedElementId = null;
    let currentDragOffsetX = 0;
    let currentDragOffsetY = 0;

    // Instância global do DOMParser para otimização
    const domParser = new DOMParser();


    // --- Funções Auxiliares para Aplicação de Estilos ao Banner Principal ---

    function applyWidth(value) {
        const parsedValue = parseInt(value);
        const clampedValue = Math.max(parseInt(containerWidthSlider.min), Math.min(parseInt(containerWidthSlider.max), parsedValue));

        if (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 1800) {
            currentIntendedWidth = parsedValue;
            editableContainer.style.width = `${clampedValue}px`;
            containerWidthNumber.value = clampedValue;
            containerWidthSlider.value = clampedValue;
            containerWidthValueSpan.textContent = `${clampedValue}px`;
        }
    }

    function applyHeight(value) {
        const parsedValue = parseInt(value);
        const clampedValue = Math.max(parseInt(containerHeightSlider.min), Math.min(parseInt(containerHeightSlider.max), parsedValue));

        if (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 1800) {
            currentIntendedHeight = parsedValue;
            editableContainer.style.height = `${clampedValue}px`;
            containerHeightNumber.value = clampedValue;
            containerHeightSlider.value = clampedValue;
            containerHeightValueSpan.textContent = `${clampedValue}px`;
        }
    }

    function applyBorderRadius(value) {
        const parsedValue = parseInt(value);
        if (!isNaN(parsedValue)) {
            editableContainer.style.borderRadius = `${parsedValue}px`;
            borderRadiusInput.value = parsedValue;
            borderRadiusValueSpan.textContent = `${parsedValue}px`;
        }
    }

    function applyBackgroundPosition() {
        const posX = backgroundPositionXNumber.value + '%';
        const posY = backgroundPositionYNumber.value + '%';
        editableContainer.style.backgroundPosition = `${posX} ${posY}`;
        backgroundPositionXValueSpan.textContent = posX;
        backgroundPositionYValueSpan.textContent = posY;
    }

    function applyBackgroundImage(file) {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                currentBackgroundImageUrl = e.target.result;
                editableContainer.style.backgroundImage = `url(${currentBackgroundImageUrl})`;
                editableContainer.style.backgroundSize = 'cover';
                editableContainer.style.backgroundRepeat = 'no-repeat';
                applyBackgroundPosition(); // Aplica a posição atual
            };
            reader.readAsDataURL(file);
        } else {
            currentBackgroundImageUrl = null;
            editableContainer.style.backgroundImage = 'none';
        }
    }

    // --- Helper para criar/atualizar um elemento HTML com estilos inline ---
    function createOrUpdateElementContent(block) {
        // Cria um elemento temporário para garantir que o HTML está bem formado para parse
        // O elemento principal do bloco (p, h1, ul, img)
        let elementToRender = null; 

        // Se o bloco é de texto ou imagem, seu HTMLContent é a string outerHTML completa
        // com estilos inline já aplicados por edições anteriores.
        // Tentamos parsear isso primeiro.
        const tempDoc = domParser.parseFromString(block.htmlContent, 'text/html');
        elementToRender = tempDoc.body.firstElementChild;

        // Fallback: Se o parsing falhou ou a tag não é a esperada, cria um novo elemento
        // e define seu conteúdo/atributos iniciais.
        if (!elementToRender || (block.originalTag && elementToRender.tagName.toLowerCase() !== block.originalTag)) {
            elementToRender = document.createElement(block.originalTag || 'div');
            if (block.originalTag === 'p' || block.originalTag === 'h1') {
                // Para p/h1, block.htmlContent armazena o texto puro (inicialmente),
                // então setamos textContent.
                elementToRender.textContent = block.htmlContent; 
            } else if (block.originalTag === 'ul' || block.originalTag === 'ol') {
                // Para listas, block.htmlContent é o innerHTML (li's)
                elementToRender.innerHTML = block.htmlContent;
            } else if (block.originalTag === 'img') {
                elementToRender.src = block.src || '';
                elementToRender.alt = block.alt || '';
            } else {
                elementToRender.innerHTML = block.htmlContent; // Fallback para outros tipos
            }
        }
        
        // Aplica estilos CSS diretamente ao objeto style do elemento.
        // Isso sobrescreve estilos inline existentes (se houver) para as propriedades que estamos controlando.
        if (block.type === 'text' || block.type === 'heading' || block.type === 'list') {
            elementToRender.style.fontSize = block.fontSize || '';
            elementToRender.style.color = block.color || '';
            elementToRender.style.fontStyle = block.fontStyle || 'normal';
            elementToRender.style.fontWeight = block.fontWeight || 'normal';
        } else if (block.type === 'image') {
            if (block.width) {
                // Adiciona 'px' se o valor for numérico e não tiver unidade
                elementToRender.style.width = (String(block.width).endsWith('px') || String(block.width).endsWith('%') || String(block.width).endsWith('em')) ? block.width : `${block.width}px`;
            } else {
                elementToRender.style.removeProperty('width');
            }
            if (block.height) {
                elementToRender.style.height = (String(block.height).endsWith('px') || String(block.height).endsWith('%') || String(block.height).endsWith('em')) ? block.height : `${block.height}px`;
            } else {
                elementToRender.style.removeProperty('height');
            }
            elementToRender.style.display = 'block'; // Garante que a imagem seja um bloco para layout
        }
       
        // ATUALIZA o `htmlContent` do objeto `block` com o `outerHTML` do elemento renderizado.
        // ESSENCIAL para persistir TODAS as mudanças (estilos inline, atributos)
        // para a próxima vez que o bloco for renderizado.
        block.htmlContent = elementToRender.outerHTML;

        return elementToRender;
    }


    // --- Renderiza blocos do array 'addedBlocks' para o banner ---
    function renderBlocksToBanner() {
        editableContainer.innerHTML = ''; // Limpa o banner
        let generatedHtml = '';

        addedBlocks.forEach(block => {
            const blockElementWrapper = document.createElement('div'); // Wrapper para o bloco
            blockElementWrapper.dataset.blockId = block.id; // Armazena o ID para referência
            blockElementWrapper.style.position = 'absolute';
            blockElementWrapper.style.left = `${block.x}px`;
            blockElementWrapper.style.top = `${block.y}px`;
            blockElementWrapper.style.cursor = block.locked ? 'default' : 'grab'; // Cursor de arrastar ou padrão

            // Cria o elemento interno e aplica estilos
            const innerContentElement = createOrUpdateElementContent(block); // Esta função já atualiza block.htmlContent
            if (innerContentElement) {
                blockElementWrapper.appendChild(innerContentElement);
            } else {
                // Fallback se createElementWithInlineStyles falhar
                blockElementWrapper.innerHTML = block.htmlContent;
            }

            // Adiciona/remove classe 'locked' para estilos visuais
            if (block.locked) {
                blockElementWrapper.classList.add('locked');
                blockElementWrapper.draggable = false;
            } else {
                blockElementWrapper.classList.remove('locked');
                blockElementWrapper.draggable = true;
            }

            editableContainer.appendChild(blockElementWrapper);
            generatedHtml += blockElementWrapper.outerHTML + '\n'; // Constrói o HTML gerado
        });

        htmlEditor.value = generatedHtml.trim(); // Atualiza a textarea com o HTML gerado
    }

    // --- Renderiza a lista de elementos adicionados com seus controles ---
    function updateAddedElementsList() {
        addedElementsList.innerHTML = ''; // Limpa a lista existente

        if (addedBlocks.length === 0) {
            const msg = document.createElement('p');
            msg.classList.add('no-elements-message');
            msg.textContent = 'Nenhum elemento adicionado ainda.';
            addedElementsList.appendChild(msg);
            return;
        } else {
            const existingMessage = addedElementsList.querySelector('.no-elements-message');
            if (existingMessage) {
                existingMessage.remove();
            }
        }

        addedBlocks.forEach(block => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('added-element-item');
            itemDiv.dataset.blockId = block.id;

            let blockTitle = block.type.charAt(0).toUpperCase() + block.type.slice(1);

            // Extrai o conteúdo e estilos para preencher os inputs de controle
            // Usa DOMParser para recriar o elemento a partir de `block.htmlContent` e extrair as propriedades
            const tempDoc = domParser.parseFromString(block.htmlContent, 'text/html');
            const innerElementForControls = tempDoc.body.firstElementChild; // O elemento principal do bloco
            
            let contentForEditor = '';
            let fontSizeForControls = '';
            let colorForControls = '#FFFFFF';
            let fontWeightForControls = 'normal';
            let fontStyleForControls = 'normal';
            let imageWidthForControls = '';
            let imageHeightForControls = '';

            if (innerElementForControls) {
                if (block.type === 'text' || block.type === 'heading') {
                    contentForEditor = innerElementForControls.textContent; // Texto puro para p, h1
                    fontSizeForControls = parseFloat(innerElementForControls.style.fontSize) || ''; // Pega o valor numérico
                    colorForControls = innerElementForControls.style.color || '#FFFFFF';
                    fontWeightForControls = innerElementForControls.style.fontWeight || 'normal';
                    fontStyleForControls = innerElementForControls.style.fontStyle || 'normal';
                } else if (block.type === 'list') {
                    contentForEditor = innerElementForControls.innerHTML; // innerHTML para listas
                    fontSizeForControls = parseFloat(innerElementForControls.style.fontSize) || '';
                    colorForControls = innerElementForControls.style.color || '#FFFFFF';
                    fontWeightForControls = innerElementForControls.style.fontWeight || 'normal';
                    fontStyleForControls = innerElementForControls.style.fontStyle || 'normal';
                } else if (block.type === 'image') {
                    imageWidthForControls = innerElementForControls.style.width || block.width || '';
                    imageHeightForControls = innerElementForControls.style.height || block.height || '';
                    // Remove "px" ou outras unidades para o input type="text" para facilitar a edição
                    imageWidthForControls = String(imageWidthForControls).replace('px', '').replace('%', '').replace('em', '');
                    imageHeightForControls = String(imageHeightForControls).replace('px', '').replace('%', '').replace('em', '');
                }
            }


            let specificControlsHtml = ``;
            if (block.type === 'text' || block.type === 'heading' || block.type === 'list') {
                specificControlsHtml = `
                    <label>Conteúdo:</label>
                    <textarea class="block-content-editor" data-id="${block.id}" rows="3">${contentForEditor}</textarea>
                    <label>Tamanho Fonte (px):</label>
                    <input type="number" class="block-font-size-number" data-id="${block.id}" value="${fontSizeForControls}" min="8" max="72">
                    <input type="range" class="block-font-size-slider" data-id="${block.id}" min="8" max="72" value="${fontSizeForControls || 16}">
                    <label>Cor:</label>
                    <input type="color" class="block-color" data-id="${block.id}" value="${colorForControls}">
                    <div class="text-format-buttons">
                        <button class="bold-toggle ${fontWeightForControls === 'bold' ? 'active' : ''}" data-id="${block.id}" title="Negrito">B</button>
                        <button class="italic-toggle ${fontStyleForControls === 'italic' ? 'active' : ''}" data-id="${block.id}" title="Itálico">I</button>
                    </div>
                `;
            } else if (block.type === 'image') {
                specificControlsHtml = `
                    <label>Trocar Imagem:</label>
                    <input type="file" class="block-image-upload" data-id="${block.id}" accept="image/*">
                    <label>Largura (px / auto):</label>
                    <input type="text" class="block-image-width" data-id="${block.id}" value="${imageWidthForControls}" placeholder="auto">
                    <label>Altura (px / auto):</label>
                    <input type="text" class="block-image-height" data-id="${block.id}" value="${imageHeightForControls}" placeholder="auto">
                `;
            }

            itemDiv.innerHTML = `
                <h4>
                    ${blockTitle} (ID: ${block.id})
                    <div class="action-buttons">
                        <button class="lock-toggle ${block.locked ? 'active' : ''}" data-id="${block.id}" title="${block.locked ? 'Desbloquear' : 'Bloquear'}">
                            ${block.locked ? '🔒' : '🔓'}
                        </button>
                        <button class="remove-block-btn" data-id="${block.id}" title="Remover Elemento">❌</button>
                    </div>
                </h4>
                <div class="controls">
                    <label>Pos X:</label>
                    <input type="number" class="block-pos-x" data-id="${block.id}" value="${Math.round(block.x)}">
                    <label>Pos Y:</label>
                    <input type="number" class="block-pos-y" data-id="${block.id}" value="${Math.round(block.y)}">
                    ${specificControlsHtml}
                </div>
            `;

            addedElementsList.appendChild(itemDiv);

            // --- Adicionar event listeners para os controles dinâmicos ---
            // Estes listeners AGORA CHAMAM renderBlocksToBanner() IMEDIATAMENTE após a mudança.
            const currentBlockRef = addedBlocks.find(b => b.id === block.id);

            itemDiv.querySelector('.block-pos-x').addEventListener('input', (e) => {
                currentBlockRef.x = parseInt(e.target.value);
                renderBlocksToBanner(); // APLICA EM TEMPO REAL
            });
            itemDiv.querySelector('.block-pos-y').addEventListener('input', (e) => {
                currentBlockRef.y = parseInt(e.target.value);
                renderBlocksToBanner(); // APLICA EM TEMPO REAL
            });

            if (block.type === 'text' || block.type === 'heading' || block.type === 'list') {
                const contentEditor = itemDiv.querySelector('.block-content-editor');
                contentEditor.addEventListener('input', (e) => {
                    // Para p ou h1, atualiza textContent. Para lista, innerHTML.
                    if (currentBlockRef.originalTag === 'p' || currentBlockRef.originalTag === 'h1') {
                         currentBlockRef.htmlContent = e.target.value;
                    } else if (currentBlockRef.originalTag === 'ul' || currentBlockRef.originalTag === 'ol') {
                         currentBlockRef.htmlContent = e.target.value; // Salva o innerHTML puro da lista
                    }
                    renderBlocksToBanner(); // APLICA EM TEMPO REAL
                });

                const fontSizeNumberInput = itemDiv.querySelector('.block-font-size-number');
                const fontSizeSliderInput = itemDiv.querySelector('.block-font-size-slider');

                fontSizeNumberInput.addEventListener('input', (e) => {
                    let value = parseInt(e.target.value);
                    if (isNaN(value) || value < parseInt(fontSizeSliderInput.min)) value = parseInt(fontSizeSliderInput.min);
                    if (value > parseInt(fontSizeSliderInput.max)) value = parseInt(fontSizeSliderInput.max);
                    currentBlockRef.fontSize = `${value}px`;
                    fontSizeSliderInput.value = value;
                    renderBlocksToBanner(); // APLICA EM TEMPO REAL
                });
                fontSizeSliderInput.addEventListener('input', (e) => {
                    currentBlockRef.fontSize = `${e.target.value}px`;
                    fontSizeNumberInput.value = e.target.value;
                    renderBlocksToBanner(); // APLICA EM TEMPO REAL
                });
                
                itemDiv.querySelector('.block-color').addEventListener('input', (e) => {
                    currentBlockRef.color = e.target.value;
                    renderBlocksToBanner(); // APLICA EM TEMPO REAL
                });
                itemDiv.querySelector('.bold-toggle').addEventListener('click', (e) => {
                    currentBlockRef.fontWeight = (currentBlockRef.fontWeight === 'bold' ? 'normal' : 'bold');
                    e.target.classList.toggle('active', currentBlockRef.fontWeight === 'bold');
                    renderBlocksToBanner(); // APLICA EM TEMPO REAL
                });
                itemDiv.querySelector('.italic-toggle').addEventListener('click', (e) => {
                    currentBlockRef.fontStyle = (currentBlockRef.fontStyle === 'italic' ? 'normal' : 'italic');
                    e.target.classList.toggle('active', currentBlockRef.fontStyle === 'italic');
                    renderBlocksToBanner(); // APLICA EM TEMPO REAL
                });
            }

            if (block.type === 'image') {
                itemDiv.querySelector('.block-image-upload').addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            currentBlockRef.src = event.target.result;
                            renderBlocksToBanner(); // APLICA EM TEMPO REAL
                        };
                        reader.readAsDataURL(file);
                    }
                });
                itemDiv.querySelector('.block-image-width').addEventListener('input', (e) => {
                    currentBlockRef.width = e.target.value; // Permite 'auto', '100px', '50%'
                    renderBlocksToBanner(); // APLICA EM TEMPO REAL
                });
                itemDiv.querySelector('.block-image-height').addEventListener('input', (e) => {
                    currentBlockRef.height = e.target.value; // Permite 'auto', '100px', '50%'
                    renderBlocksToBanner(); // APLICA EM TEMPO REAL
                });
            }

            itemDiv.querySelector('.lock-toggle').addEventListener('click', (e) => {
                currentBlockRef.locked = !currentBlockRef.locked;
                e.target.textContent = currentBlockRef.locked ? '🔒' : '🔓';
                e.target.title = currentBlockRef.locked ? 'Desbloquear' : 'Bloquear';
                e.target.classList.toggle('active', currentBlockRef.locked); // Adiciona/remove classe 'active'
                renderBlocksToBanner(); // APLICA EM TEMPO REAL
            });

            itemDiv.querySelector('.remove-block-btn').addEventListener('click', (e) => {
                // A remoção ainda é imediata para melhor UX
                addedBlocks = addedBlocks.filter(b => b.id !== currentBlockRef.id);
                renderBlocksToBanner();
                updateAddedElementsList(); // Atualiza a lista
            });
        });
    }


    // --- Lógica das Abas ---
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            const targetTabId = button.dataset.tab;
            document.getElementById(`tab-${targetTabId}`).classList.add('active');
        });
    });

    // --- Lógica do Acordeão ---
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentContent = header.nextElementSibling;
            header.classList.toggle('active');
            currentContent.classList.toggle('active');
        });
    });


    // --- Lógica de Drag and Drop para Novos Blocos (da aba "Blocos HTML") ---
    draggableBlocks.forEach(block => {
        block.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify({
                type: e.target.dataset.type,
                initialContent: e.target.dataset.initialContent || '',
                initialFontSize: e.target.dataset.initialFontSize || '',
                initialColor: e.target.dataset.initialColor || '',
                initialSrc: e.target.dataset.initialSrc || '',
                initialWidth: e.target.dataset.initialWidth || 'auto',
                initialHeight: e.target.dataset.initialHeight || 'auto',
                initialAlt: e.target.dataset.initialAlt || ''
            }));
            e.dataTransfer.effectAllowed = 'copy';
        });
    });

    // Eventos de Drop no editableContainer (para novos blocos)
    editableContainer.addEventListener('dragover', (e) => {
        e.preventDefault(); // Permite o drop
        e.dataTransfer.dropEffect = 'copy';
        editableContainer.classList.add('drag-over'); // Adiciona feedback visual
    });

    editableContainer.addEventListener('dragleave', () => {
        editableContainer.classList.remove('drag-over'); // Remove feedback visual
    });

    editableContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        editableContainer.classList.remove('drag-over'); // Remove feedback visual

        if (currentDraggedElementId !== null) { // Se for um elemento existente sendo arrastado, ignora este drop
            currentDraggedElementId = null; // Reseta após a verificação
            return;
        }

        const droppedData = JSON.parse(e.dataTransfer.getData('text/plain'));
        const bannerRect = editableContainer.getBoundingClientRect();

        const bannerPaddingLeft = parseFloat(getComputedStyle(editableContainer).paddingLeft);
        const bannerPaddingTop = parseFloat(getComputedStyle(editableContainer).paddingTop);

        let x = e.clientX - bannerRect.left - bannerPaddingLeft;
        let y = e.clientY - bannerRect.top - bannerPaddingTop;

        x += editableContainer.scrollLeft;
        y += editableContainer.scrollTop;

        x = Math.max(0, x);
        y = Math.max(0, y);


        let newBlock = {
            id: nextBlockId++,
            type: droppedData.type,
            x: x,
            y: y,
            locked: false,
            fontStyle: 'normal', // Padrão
            fontWeight: 'normal', // Padrão
            originalTag: null // Para armazenar a tag HTML principal (p, h1, ul, img)
        };

        if (droppedData.type === 'text') {
            newBlock.htmlContent = droppedData.initialContent;
            newBlock.fontSize = droppedData.initialFontSize ? `${droppedData.initialFontSize}px` : ''; // Adiciona 'px'
            newBlock.color = droppedData.initialColor;
            newBlock.originalTag = 'p';
        } else if (droppedData.type === 'heading') {
            newBlock.htmlContent = droppedData.initialContent;
            newBlock.fontSize = droppedData.initialFontSize ? `${droppedData.initialFontSize}px` : ''; // Adiciona 'px'
            newBlock.color = droppedData.initialColor;
            newBlock.originalTag = 'h1';
        } else if (droppedData.type === 'list') {
            newBlock.htmlContent = droppedData.initialContent;
            newBlock.fontSize = droppedData.initialFontSize ? `${droppedData.initialFontSize}px` : '';
            newBlock.color = droppedData.initialColor;
            newBlock.originalTag = 'ul';
        } else if (droppedData.type === 'image') {
            newBlock.src = droppedData.initialSrc;
            newBlock.width = droppedData.initialWidth;
            newBlock.height = droppedData.initialHeight;
            newBlock.alt = droppedData.initialAlt;
            newBlock.originalTag = 'img';
        }

        addedBlocks.push(newBlock);
        
        renderBlocksToBanner(); // Renderiza e atualiza a lista IMEDIATAMENTE APÓS DROPAR UM NOVO BLOCO
        updateAddedElementsList(); // ATUALIZA A LISTA IMEDIATAMENTE
    });

    // --- Lógica de Arrastar e Soltar para ELEMENTOS JÁ NO BANNER ---
    editableContainer.addEventListener('dragstart', (e) => {
        const targetBlockElement = e.target.closest('div[data-block-id]'); // Certifica-se de pegar o wrapper do bloco
        if (targetBlockElement) {
            const blockId = parseInt(targetBlockElement.dataset.blockId);
            const block = addedBlocks.find(b => b.id === blockId);

            if (block && block.locked) {
                e.preventDefault(); // Impede arrastar se estiver bloqueado
                return;
            }

            currentDraggedElementId = blockId;
            currentDragOffsetX = e.clientX - targetBlockElement.getBoundingClientRect().left;
            currentDragOffsetY = e.clientY - targetBlockElement.getBoundingClientRect().top;

            e.dataTransfer.setDragImage(targetBlockElement, currentDragOffsetX, currentDragOffsetY);
            e.dataTransfer.effectAllowed = 'move';
        }
    });

    window.addEventListener('dragend', (e) => {
        if (currentDraggedElementId === null) return; // Não há bloco do banner sendo arrastado

        const block = addedBlocks.find(b => b.id === currentDraggedElementId);
        if (!block || block.locked) {
            currentDraggedElementId = null;
            return;
        }

        const bannerRect = editableContainer.getBoundingClientRect();

        const bannerPaddingLeft = parseFloat(getComputedStyle(editableContainer).paddingLeft);
        const bannerPaddingTop = parseFloat(getComputedStyle(editableContainer).paddingTop);

        let newX = e.clientX - bannerRect.left - currentDragOffsetX - bannerPaddingLeft;
        let newY = e.clientY - bannerRect.top - currentDragOffsetY - bannerPaddingTop;

        newX += editableContainer.scrollLeft;
        newY += editableContainer.scrollTop;

        newX = Math.max(0, newX);
        newY = Math.max(0, newY);

        block.x = newX;
        block.y = newY;

        currentDraggedElementId = null;
        currentDragOffsetX = 0;
        currentDragOffsetY = 0;

        renderBlocksToBanner(); // Redesenha tudo com a nova posição
        updateAddedElementsList(); // Atualiza a lista de controles
    });


    // --- Inicialização de Controles ---
    applyWidth(containerWidthNumber.value);
    applyHeight(containerHeightNumber.value);
    applyBorderRadius(parseFloat(getComputedStyle(editableContainer).borderRadius));

    const initialBackgroundPositionX = 50;
    const initialBackgroundPositionY = 50;
    backgroundPositionXNumber.value = initialBackgroundPositionX;
    backgroundPositionXSlider.value = initialBackgroundPositionX;
    backgroundPositionYNumber.value = initialBackgroundPositionY;
    backgroundPositionYSlider.value = initialBackgroundPositionY;
    applyBackgroundPosition();

    renderBlocksToBanner();
    updateAddedElementsList();


    // --- Event Listeners para Controles de Design (globais) ---
    containerWidthNumber.addEventListener('input', (e) => applyWidth(e.target.value));
    containerWidthSlider.addEventListener('input', (e) => applyWidth(e.target.value));
    containerHeightNumber.addEventListener('input', (e) => applyHeight(e.target.value));
    containerHeightSlider.addEventListener('input', (e) => applyHeight(e.target.value));
    borderRadiusInput.addEventListener('input', (e) => applyBorderRadius(e.target.value));
    backgroundPositionXNumber.addEventListener('input', (e) => {
        backgroundPositionXSlider.value = e.target.value;
        applyBackgroundPosition();
    });
    backgroundPositionXSlider.addEventListener('input', (e) => {
        backgroundPositionXNumber.value = e.target.value;
        applyBackgroundPosition();
    });
    backgroundPositionYNumber.addEventListener('input', (e) => {
        backgroundPositionYSlider.value = e.target.value;
        applyBackgroundPosition();
    });
    backgroundPositionYSlider.addEventListener('input', (e) => {
        backgroundPositionYNumber.value = e.target.value;
        applyBackgroundPosition();
    });
    backgroundImageUpload.addEventListener('change', (e) => {
        applyBackgroundImage(e.target.files.length > 0 ? e.target.files[0] : null);
    });

    htmlEditor.addEventListener('input', (e) => {
        editableContainer.innerHTML = e.target.value;
    });


    // --- Botão "Aplicar Mudanças" (feedback visual ou para outras funcionalidades) ---
    applyChangesBtn.addEventListener('click', () => {
        renderBlocksToBanner(); // Garante que as mudanças nos blocos sejam aplicadas
        updateAddedElementsList(); // Garante que a lista de controles esteja sincronizada

        const messageBox = document.createElement('div');
        messageBox.textContent = 'Configurações atualizadas!';
        messageBox.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #2ecc71;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        `;
        document.body.appendChild(messageBox);

        setTimeout(() => {
            messageBox.style.opacity = 1;
        }, 10);

        setTimeout(() => {
            messageBox.style.opacity = 0;
            messageBox.addEventListener('transitionend', () => messageBox.remove());
        }, 2000);
    });


    // --- Botão para fechar/diminuir a imagem gerada ---
    toggleImagePreviewBtn.addEventListener('click', () => {
        const imgElement = imagePreview.querySelector('img');
        const downloadLink = imagePreview.querySelector('a');
        const minimizeBtn = document.getElementById('minimizeImagePreviewBtn');

        if (imgElement && imgElement.style.display !== 'none') {
            imgElement.style.display = 'none';
            if (downloadLink) downloadLink.style.display = 'none';
            if (minimizeBtn) minimizeBtn.style.display = 'none';
            toggleImagePreviewBtn.textContent = 'Mostrar Imagem';
        } else if (imgElement) {
            imgElement.style.display = 'block';
            if (downloadLink) downloadLink.style.display = 'inline-block';
            if (minimizeBtn) minimizeBtn.style.display = 'inline-block';
            toggleImagePreviewBtn.textContent = 'Esconder Imagem';
        }
    });

    minimizeImagePreviewBtn.addEventListener('click', () => {
        const imgElement = imagePreview.querySelector('img');
        const downloadLink = imagePreview.querySelector('a');

        if (imgElement && imgElement.style.maxHeight !== '50px') {
            imgElement.style.maxWidth = '100px';
            imgElement.style.maxHeight = '50px';
            imgElement.style.overflow = 'hidden';
            imgElement.style.cursor = 'zoom-in';
            if (downloadLink) downloadLink.style.display = 'none';
            minimizeImagePreviewBtn.textContent = 'Restaurar Imagem';
        } else if (imgElement) {
            imgElement.style.maxWidth = 'none';
            imgElement.style.maxHeight = 'none';
            imgElement.style.overflow = 'visible';
            imgElement.style.cursor = 'default';
            if (downloadLink) downloadLink.style.display = 'inline-block';
            minimizeImagePreviewBtn.textContent = 'Minimizar Imagem';
        }
    });


    // --- Event Listener para o botão "Gerar Imagem" (com truque de redimensionamento) ---
    captureImageBtn.addEventListener('click', () => {
        const blackMenu = document.querySelector('.black-menu');
        const bannerPreviewContainer = document.querySelector('.banner-preview-container'); // Adicionado

        // Salvar os estilos originais do banner E do seu container pai (se necessário)
        const originalBlueRectWidth = editableContainer.style.width;
        const originalBlueRectHeight = editableContainer.style.height;
        const originalBlueRectMaxWidth = editableContainer.style.maxWidth;
        const originalBlueRectMaxHeight = editableContainer.style.maxHeight;
        const originalBlueRectOverflow = editableContainer.style.overflow;
        // Salvar estilos do banner-preview-container
        const originalBannerPreviewContainerFlex = bannerPreviewContainer.style.flex;
        const originalBannerPreviewContainerWidth = bannerPreviewContainer.style.width;
        const originalBannerPreviewContainerMaxWidth = bannerPreviewContainer.style.maxWidth;


        blackMenu.style.display = 'none';

        // Tentar remover as restrições do container pai temporariamente para garantir expansão do banner
        bannerPreviewContainer.style.flex = 'none';
        // Ajusta a largura para ser o tamanho total que o banner PRECISA ocupar (intended width + padding)
        bannerPreviewContainer.style.width = `${currentIntendedWidth + 40}px`; // 40px = 2*padding do editableContainer
        bannerPreviewContainer.style.maxWidth = 'none'; // Remover max-width do pai também


        editableContainer.classList.add('capturing');
        // Definir Custom Properties CSS para usar em .capturing
        editableContainer.style.setProperty('--intended-width-px', `${currentIntendedWidth}px`);
        editableContainer.style.setProperty('--intended-height-px', `${currentIntendedHeight}px`);
        editableContainer.style.overflow = 'hidden';


        requestAnimationFrame(() => {
            html2canvas(editableContainer, {
                scale: 2,
                useCORS: true
            }).then(canvas => {
                // Restaurar estilos do menu e banner
                blackMenu.style.display = 'block';
                editableContainer.classList.remove('capturing');
                // Remover Custom Properties
                editableContainer.style.removeProperty('--intended-width-px');
                editableContainer.style.removeProperty('--intended-height-px');
                
                editableContainer.style.width = originalBlueRectWidth;
                editableContainer.style.height = originalBlueRectHeight;
                editableContainer.style.maxWidth = originalBlueRectMaxWidth;
                editableContainer.style.maxHeight = originalBlueRectMaxHeight;
                editableContainer.style.overflow = originalBlueRectOverflow;

                // Restaurar estilos do container pai
                bannerPreviewContainer.style.flex = originalBannerPreviewContainerFlex;
                bannerPreviewContainer.style.width = originalBannerPreviewContainerWidth;
                bannerPreviewContainer.style.maxWidth = originalBannerPreviewContainerMaxWidth;


                applyWidth(containerWidthNumber.value); // Reaplicar para o estado responsivo
                applyHeight(containerHeightNumber.value);


                const img = document.createElement('img');
                img.src = canvas.toDataURL('image/png');
                img.alt = 'Banner Capturado';

                imagePreview.innerHTML = '';
                imagePreview.appendChild(img);

                const downloadLink = document.createElement('a');
                downloadLink.href = img.src;
                downloadLink.download = 'banner-editado.png';
                downloadLink.textContent = 'Baixar Imagem';
                imagePreview.appendChild(downloadLink);

                toggleImagePreviewBtn.style.display = 'inline-block';
                toggleImagePreviewBtn.textContent = 'Esconder Imagem';
                minimizeImagePreviewBtn.style.display = 'inline-block';

            }).catch(error => {
                // Restaurar estilos mesmo em caso de erro
                blackMenu.style.display = 'block';
                editableContainer.classList.remove('capturing');
                editableContainer.style.removeProperty('--intended-width-px');
                editableContainer.style.removeProperty('--intended-height-px');

                editableContainer.style.width = originalBlueRectWidth;
                editableContainer.style.height = originalBlueRectHeight;
                editableContainer.style.maxWidth = originalBlueRectMaxWidth;
                editableContainer.style.maxHeight = originalBlueRectMaxHeight;
                editableContainer.style.overflow = originalBlueRectOverflow;

                // Restaurar estilos do container pai
                bannerPreviewContainer.style.flex = originalBannerPreviewContainerFlex;
                bannerPreviewContainer.style.width = originalBannerPreviewContainerWidth;
                bannerPreviewContainer.style.maxWidth = originalBannerPreviewContainerMaxWidth;

                applyWidth(containerWidthNumber.value);
                applyHeight(containerHeightNumber.value);

                console.error('Erro ao gerar a imagem:', error);

                const errorBox = document.createElement('div');
                errorBox.textContent = 'Erro ao gerar a imagem. Verifique o console para mais detalhes.';
                errorBox.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #e74c3c;
                    color: white;
                    padding: 15px 25px;
                    border-radius: 8px;
                    z-index: 1000;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    opacity: 0;
                    transition: opacity 0.5s ease-in-out;
                `;
                document.body.appendChild(errorBox);

                setTimeout(() => {
                    errorBox.style.opacity = 1;
                }, 10);

                setTimeout(() => {
                    errorBox.style.opacity = 0;
                    errorBox.addEventListener('transitionend', () => errorBox.remove());
                }, 3000);
            });
        });
    });
});