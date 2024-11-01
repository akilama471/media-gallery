document.addEventListener('DOMContentLoaded', async () => {
  const gallery = document.getElementById('gallery');
  const folderButton = document.getElementById('folderButton');
  const progressBar = document.getElementById('progressBar');

  folderButton.addEventListener('click', async () => {
    const folderPath = await window.electronAPI.selectFolder();
    if (folderPath) {
      gallery.innerHTML = '';
      progressBar.style.display = 'block';
      const { mediaFiles, thumbnails } = await window.electronAPI.scanFolder();
      progressBar.style.display = 'none';
      updateGallery(thumbnails);
    }
  });

  window.electronAPI.onThumbnailProgress((event, { processedCount, totalCount }) => {
    progressBar.value = (processedCount / totalCount) * 100;
  });

  function updateGallery(files) {
    gallery.innerHTML = '';
    files.forEach(file => {
      const element = document.createElement('img');
      element.src = `file://${file.thumbnail}`;
      element.className = 'gallery-item';
      gallery.appendChild(element);
    });
  }
});
