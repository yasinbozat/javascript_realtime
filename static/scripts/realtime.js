'use strict'
class Realtime {
    constructor(URL,WaitingTime, LastWaitingTime, Start){
        this.URL = URL;
        this.WaitingTime = WaitingTime;
        this.LastWaitingTime = LastWaitingTime;
        this.Start = Start;
        this.controller = new AbortController(); // AbortController oluşturuldu

        if (this.Start) {
            this.start();
        }
    }

    start(){
        console.log("istek atıldı.")
        this.controller = new AbortController();
        const timeout = setTimeout(() => {
            this.controller.abort(); // Zaman aşımı süresi aşıldığında işlemi iptal et
          }, this.LastWaitingTime);

        fetch(this.URL, { signal: this.controller.signal })
        .then(response => {
            clearTimeout(timeout); // İşlem tamamlandığında zaman aşımı süresini iptal et
            if(response.ok){
                return response.json();
            }
            else {
                console.error('İstek başarısız. Durum kodu: ' + response.status);
            }
        })
        .then(data => {
            // Alınan veriyle yapılacak işlemler
            console.log(data);
        })
        .catch(error => {
            if (error.name === 'AbortError') {
                console.log('Zaman aşımı süresi aşıldı');
              } else {
                console.error(error);
              }
        })
        .finally(() => {
            setTimeout(() => {
                this.start(); // Arrow function kullanarak doğru bağlamı koru
            }, this.WaitingTime);
        });
    }
}
