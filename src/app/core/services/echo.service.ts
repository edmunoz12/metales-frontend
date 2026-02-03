import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EchoService {
  public echo!: Echo<any>;

  constructor() {
     console.log('EchoService constructor ejecutado');
    (window as any).Pusher = Pusher;

    this.echo = new Echo({
      broadcaster: 'pusher',
      key: 'parprohub',
      cluster: environment.cluster, // 👈 ESTE ES EL FIX
      wsHost: environment.wsHost,
      wsPort: environment.wsPort,
      wssPort: environment.wsPort,
      forceTLS: false,
      disableStats: true,
      enabledTransports: ['ws'], // 🔥 CLAVE
    });
     console.log(' Echo inicializado', this.echo);
  }
}
