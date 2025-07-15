import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './NotificationNative2.types';

type NotificationNative2ModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class NotificationNative2Module extends NativeModule<NotificationNative2ModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(NotificationNative2Module, 'NotificationNative2Module');
