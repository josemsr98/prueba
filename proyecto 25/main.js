// main.js
// Interactividad y galería

window.addEventListener('DOMContentLoaded', () => {
    // Mensaje de aniversario
    const extraSection = document.querySelector('.extra');
    if (extraSection) {
        const mensaje = document.createElement('p');
        mensaje.textContent = 'Te amo más cada día ❤️';
        mensaje.style.fontSize = '1.3rem';
        mensaje.style.color = '#ffb6b9';
        extraSection.appendChild(mensaje);
    }

    // Cloudinary integration
    const CLOUD_NAME = 'dgktjzoot';
    const UPLOAD_PRESET = 'unsigned_preset'; // Debes crear un upload preset sin firmar en Cloudinary

    const cloudinaryForm = document.getElementById('cloudinary-upload-form');
    const cloudinaryStatus = document.getElementById('cloudinary-status');
    const cloudinaryGallery = document.getElementById('cloudinary-gallery');

    if (cloudinaryForm) {
        cloudinaryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const files = document.getElementById('cloudinary-file').files;
            if (!files.length) {
                alert('Selecciona al menos una foto.');
                return;
            }
            for (let i = 0; i < files.length; i++) {
                uploadToCloudinary(files[i]);
            }
        });
    }

    function uploadToCloudinary(file) {
        const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('tags', 'gallery'); // Añade el tag 'gallery'
        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.secure_url) {
                addPhotoToGallery(data.secure_url);
                if (cloudinaryStatus) cloudinaryStatus.textContent = 'Foto subida correctamente.';
            } else {
                if (cloudinaryStatus) cloudinaryStatus.textContent = 'Error al subir la foto.';
            }
        })
        .catch(() => {
            if (cloudinaryStatus) cloudinaryStatus.textContent = 'Error al subir la foto.';
        });
    }

    function addPhotoToGallery(url) {
        if (!cloudinaryGallery) return;
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Foto subida';
        img.style.width = '220px';
        img.style.height = '220px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '16px';
        img.style.boxShadow = '0 4px 16px rgba(255,182,185,0.12)';
        img.style.border = '3px solid #ffe6e6';
        img.style.background = '#fff';
        cloudinaryGallery.appendChild(img);
    }

    // Mostrar imágenes desde gallery.json
    const showImagesBtn = document.getElementById('show-images-btn');
    if (showImagesBtn) {
        showImagesBtn.addEventListener('click', async () => {
            showImagesBtn.disabled = true;
            showImagesBtn.textContent = 'Cargando...';
            try {
                const response = await fetch('gallery.json');
                if (!response.ok) throw new Error('No se pudo obtener la galería');
                const urls = await response.json();
                const gallery = document.getElementById('cloudinary-gallery');
                gallery.innerHTML = '';
                urls.forEach(url => {
                    const div = document.createElement('div');
                    div.style.maxWidth = '220px';
                    div.style.textAlign = 'center';
                    div.innerHTML = `<img src="${url}" alt="foto" style="width:100%; border-radius:12px; box-shadow:0 2px 8px #ccc; margin-bottom:0.5rem;">`;
                    gallery.appendChild(div);
                });
                showImagesBtn.textContent = 'Mostrar imágenes';
            } catch (err) {
                showImagesBtn.textContent = 'Mostrar imágenes';
                alert('No se pudo cargar la galería.');
            }
            showImagesBtn.disabled = false;
        });
    }
});
