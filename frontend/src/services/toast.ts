// @ts-ignore due to implicit any in 3rd party lib
import ToastEventBus from 'primevue/toasteventbus';

export const useToastService = () => {
  const showToast = (severity: string, detail: string, life = 2000) => {
    ToastEventBus.emit('add', { severity, detail, life });
  };
  return { showToast };
};
