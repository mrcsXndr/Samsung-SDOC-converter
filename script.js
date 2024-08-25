document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const selectFilesBtn = document.getElementById('selectFilesBtn');
    const selectedFiles = document.getElementById('selected-files');
    const convertBtn = document.getElementById('convertBtn');
    const clearFilesBtn = document.getElementById('clearFilesBtn');
    const result = document.getElementById('result');

    let fileList = new Set();

    // Initialize Material Components
    [selectFilesBtn, convertBtn, clearFilesBtn].forEach(btn => {
        mdc.ripple.MDCRipple.attachTo(btn);
    });

    selectFilesBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', addFiles);
    convertBtn.addEventListener('click', convertFiles);
    clearFilesBtn.addEventListener('click', clearFiles);

    function addFiles() {
        Array.from(fileInput.files).forEach(file => {
            if (file.name.endsWith('.sdoc') || file.name.endsWith('.sdocx')) {
                if (!Array.from(fileList).some(f => f.name === file.name && f.size === file.size)) {
                    fileList.add(file);
                }
            } else {
                console.warn(`Skipped file ${file.name}: Not a valid .sdoc or .sdocx file`);
            }
        });
        updateSelectedFiles();
    }

    function updateSelectedFiles() {
        selectedFiles.innerHTML = '';
        const hasFiles = fileList.size > 0;
        convertBtn.disabled = !hasFiles;
        clearFilesBtn.disabled = !hasFiles;

        Array.from(fileList).forEach((file, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'mdc-list-item';
            listItem.innerHTML = `
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">
                    <span class="mdc-list-item__primary-text">${file.name}</span>
                    <span class="mdc-list-item__secondary-text">${(file.size / 1024).toFixed(2)} KB</span>
                </span>
                <button class="mdc-icon-button remove-file" data-index="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            `;
            selectedFiles.appendChild(listItem);

            // Initialize Material icon button
            const iconButton = listItem.querySelector('.mdc-icon-button');
            new mdc.ripple.MDCRipple(iconButton).unbounded = true;
            iconButton.addEventListener('click', removeFile);
        });

        // Initialize list ripples
        selectedFiles.querySelectorAll('.mdc-list-item').forEach((listItem) => {
            mdc.ripple.MDCRipple.attachTo(listItem);
        });
    }

    function removeFile(e) {
        const index = parseInt(e.currentTarget.dataset.index);
        fileList = new Set(Array.from(fileList).filter((_, i) => i !== index));
        updateSelectedFiles();
    }

    function clearFiles() {
        fileList.clear();
        updateSelectedFiles();
    }

    async function convertFiles() {
        const outputZip = new JSZip();
        const progressBar = document.createElement('progress');
        progressBar.max = fileList.size;
        progressBar.value = 0;
        result.innerHTML = '<p>Processing files...</p>';
        result.appendChild(progressBar);

        let fileIndex = 1;

        for (const file of fileList) {
            try {
                console.log(`Processing file: ${file.name}`);
                const zip = new JSZip();
                await zip.loadAsync(file);

                let audioFiles = [];
                if (file.name.endsWith('.sdocx')) {
                    audioFiles = Object.keys(zip.files).filter(filename => filename.startsWith('media/') && filename.endsWith('.m4a'));
                } else if (file.name.endsWith('.sdoc')) {
                    audioFiles = Object.keys(zip.files).filter(filename => filename.startsWith('files/') && filename.endsWith('.m4a'));
                }

                console.log(`Found audio files in ${file.name}: ${audioFiles}`);

                for (const audioFilename of audioFiles) {
                    const audioContent = await zip.file(audioFilename).async('uint8array');
                    const fileMetadata = zip.file(audioFilename).date;
                    const formattedTimestamp = fileMetadata.toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-');
                    const newFileName = `Voice recording ${formattedTimestamp}_${fileIndex}.m4a`;
                    outputZip.file(newFileName, audioContent);
                    console.log(`Added ${newFileName} to output ZIP`);
                    fileIndex++;
                }
            } catch (error) {
                console.error(`Error processing file ${file.name}:`, error);
            }
            progressBar.value++;
        }

        try {
            const content = await outputZip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(content);
            result.innerHTML = `
                <p>Processing complete!</p>
                <a href="${url}" download="extracted_audio.zip" class="mdc-button mdc-button--raised">
                    <span class="mdc-button__ripple"></span>
                    <span class="mdc-button__label">Download ZIP</span>
                </a>
            `;
            mdc.ripple.MDCRipple.attachTo(result.querySelector('.mdc-button'));
            console.log('ZIP file created successfully');
        } catch (error) {
            console.error('Error creating ZIP:', error);
            result.innerHTML = `<p>An error occurred while creating the ZIP file: ${error.message}</p>`;
        }
    }
});