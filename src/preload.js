const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('docuflow', {
  dashboard: () => ipcRenderer.invoke('dashboard:get'),
  customers: {
    list: () => ipcRenderer.invoke('customers:list'),
    save: data => ipcRenderer.invoke('customers:save', data),
    delete: id => ipcRenderer.invoke('customers:delete', id)
  },
  documents: {
    list: () => ipcRenderer.invoke('documents:list'),
    get: id => ipcRenderer.invoke('documents:get', id),
    save: data => ipcRenderer.invoke('documents:save', data),
    delete: id => ipcRenderer.invoke('documents:delete', id),
    pdf: id => ipcRenderer.invoke('documents:pdf', id)
  },
  company: {
    get: () => ipcRenderer.invoke('company:get'),
    save: data => ipcRenderer.invoke('company:save', data),
    chooseLogo: () => ipcRenderer.invoke('company:choose-logo'),
    removeLogo: () => ipcRenderer.invoke('company:remove-logo')
  },
  templates: {
    list: () => ipcRenderer.invoke('templates:list'),
    save: data => ipcRenderer.invoke('templates:save', data),
    delete: id => ipcRenderer.invoke('templates:delete', id)
  },
  backup: {
    export: () => ipcRenderer.invoke('backup:export'),
    import: () => ipcRenderer.invoke('backup:import')
  }
});
