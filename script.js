function renderOrganigram(containerId, data) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // Limpia el contenedor
  data.forEach(person => createNode(container, person));
}
function formatPhoneNumber(phone) {
    return '549'+phone.replace(/\s+/g, '');
  }

function createNode(parentElement, personOrDept) {
    const node = document.createElement('div');
    node.className = 'node';
  
    node.innerHTML = `
    <strong>${personOrDept.nombre || personOrDept}</strong>
    <div>👤 ${personOrDept.rol || ''}</div>
    <div>📞 <a href="https://wa.me/${formatPhoneNumber(personOrDept.telefono)}" target="_blank">${personOrDept.telefono || ''}</a></div>
    <div class="email">✉️ <a href="mailto:${personOrDept.email}" class="email-link">${personOrDept.email || ''}</a></div>
    <div>📍${personOrDept.congregacion || ''}</div>
  `;
    parentElement.appendChild(node);
  
    if (personOrDept.departamentos) {
      const toggleElement = document.createElement('div');
      toggleElement.className = 'toggle-button';
      toggleElement.innerHTML = `<span class="toggle-icon">▶️</span> Ver Departamentos`;
  
      toggleElement.onclick = function() {
        if (!node.childContainer) {
          const childContainer = document.createElement('div');
          childContainer.className = 'connection department';
          node.childContainer = childContainer;
          node.appendChild(childContainer);
  
          personOrDept.departamentos.forEach(dept => {
            const deptNode = document.createElement('div');
            deptNode.className = 'node';
            deptNode.innerHTML = `
            <div class="icon">${dept.icono || '🏢'}</div><strong>${dept.nombre}</strong>`;
            childContainer.appendChild(deptNode);
  
            const integrantesContainer = document.createElement('div');
            integrantesContainer.className = 'integrantes hidden';
            deptNode.integrantesContainer = integrantesContainer;
            deptNode.appendChild(integrantesContainer);
  
            dept.integrantes.forEach(integrante => {
              const integranteNode = document.createElement('div');
              integranteNode.className = 'integranteNode';
              integranteNode.innerHTML = `
              <strong>${integrante.nombre || integrante}</strong>
              <div>👤 ${integrante.rol || ''}</div>
              <div>📞 <a href="https://wa.me/${formatPhoneNumber(integrante.telefono)}" target="_blank">${personOrDept.telefono || ''}</a></div>
              <div class="email">✉️ <a href="mailto:${integrante.email}" class="email-link">${integrante.email || ''}</a></div>
              <div>📍${integrante.congregacion || ''}</div>
            `;
          
              integrantesContainer.appendChild(integranteNode);
            });
  
            if (dept.subdepartamentos) {
              dept.subdepartamentos.forEach(subdept => {
                const subdeptNode = document.createElement('div');
                subdeptNode.className = 'subdepartment';
                subdeptNode.innerHTML = `
                <div class="icon">${subdept.icono || '📁'}</div><strong>${subdept.nombre}</strong>`;
                integrantesContainer.appendChild(subdeptNode);
  
                const subIntegrantesContainer = document.createElement('div');
                subIntegrantesContainer.className = 'integrantes hidden';
                subdeptNode.appendChild(subIntegrantesContainer);
  
                subdept.integrantes.forEach(integrante => {
                  const subIntegranteNode = document.createElement('div');
                  subIntegranteNode.className = 'integranteNode';
                  subIntegranteNode.innerHTML = `
                  <strong>${integrante.nombre || integrante}</strong>
                  <div>👤 ${integrante.rol || ''}</div>
                  <div>📞 <a href="https://wa.me/${formatPhoneNumber(integrante.telefono)}" target="_blank">${personOrDept.telefono || ''}</a></div>
                  <div class="email">✉️ <a href="mailto:${integrante.email}" class="email-link">${integrante.email || ''}</a></div>
                  <div>📍${integrante.congregacion || ''}</div>
                `;
                  subIntegrantesContainer.appendChild(subIntegranteNode);
                });
  
                subdeptNode.addEventListener('click', function(event) {
                  event.stopPropagation(); // Esto evita que el evento de clic se propague hacia arriba
                  subIntegrantesContainer.classList.toggle('hidden');
                });
              });
            }
  
            deptNode.addEventListener('click', function() {
              integrantesContainer.classList.toggle('hidden');
            });
          });
        } else {
          node.childContainer.classList.toggle('hidden');
        }
        toggleElement.classList.toggle('expanded');
      };
      node.appendChild(toggleElement);
    }
  
    if (personOrDept.subordinados) {
      personOrDept.subordinados.forEach(subordinate => {
        createNode(parentElement, subordinate);
      });
    }
  }
// Agrega estilos CSS para ocultar los elementos
const style = document.createElement('style');
style.innerHTML = `
.hidden {
  display: none;
}
.connection {
  margin-left: 20px;
}
`;
document.head.appendChild(style);

fetch('data.json')
  .then(response => response.json())
  .then(data => renderOrganigram('organigramContainer', data))
  .catch(error => console.error('Error al cargar el JSON:', error));