'use strict'
class Realtime {
    constructor(URL,WaitingTime, LastWaitingTime, Enabled, DoFunc){
        this.URL = URL;
        this.WaitingTime = WaitingTime;
        this.LastWaitingTime = LastWaitingTime;
        this.Enabled = Enabled;
        this.controller = new AbortController(); // Zaman aşımında tekrardan fonksiyona başlamak için AbortController oluşturuldu.
        this.DoFunc = DoFunc;
        this.listeners = {}; // Olay dinleyicilerini saklamak için bir nesne oluşturuldu

        if (this.Enabled) {
            this.start();
        }
    }
    
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = []; // Yeni bir olaya ait boş bir dizi oluşturuldu
        }
        this.listeners[event].push(callback); // Olay dinleyicisini diziye ekle
    }

    trigger(event, data) {
        const eventListeners = this.listeners[event];
        if (eventListeners) {
            eventListeners.forEach(callback => callback(data)); // Olay dinleyicilerini tetikle
        }
    }

    start(){
        this.trigger("fetch_start");
        this.controller = new AbortController();
        const timeout = setTimeout(() => {
            this.controller.abort(); // Zaman aşımı süresi aşıldığında işlemi iptal et
          }, this.LastWaitingTime);

        fetch(this.URL, { signal: this.controller.signal })
        .then(response => {
            clearTimeout(timeout); // İşlem tamamlandığında zaman aşımı süresini sıfırla
            if(response.ok){
                return response.json();
            }
            else {
                console.error('İstek başarısız. Durum kodu: ' + response.status);
            }
        })
        .then(data => {
            this.DoFunc(data);
        })
        .catch(error => {
            if (error.name === 'AbortError') {
                console.log('Zaman aşımı süresi aşıldı');
              } else {
                console.error(error);
              }
        })
        .finally(() => {
            this.trigger("fetch_end");
            setTimeout(() => {
                this.start();
            }, this.WaitingTime);
        });
    }
}
