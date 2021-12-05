
/**
* Użyj tego pliku, aby zdefiniować niestandardowe funkcje i bloki.
* Czytaj więcej na https://makecode.microbit.org/blocks/custom
*/

enum znaki {
    a = 0b0111100001000011,
    b = 0b0110000000000000, //+bity na adresie x0a
    c = 0b0001100001000100,
    d = 0b0111000000101100,
    e = 0b0001100001000111,
    f = 0b0001100001000011,
    g = 0b0011100001000101,
    h = 0b0110100001000011
}

/**
 * Alphanumeric display blocks
 */
//% weight=80 color=#fc0345 icon="\uf2db"
namespace HT16K33 {
    let _buf=pins.createBuffer(11);
    let i2c_addr: number; //device address - Seeed 0x71=113
    let start_display_ram: number;
    let cyfra: number[] = 
    [0b0111100001000100, // 0
    0b0110000000000000, // 1
    0b0101100000000111, // 2
    0b0111000000000111, //3
    0b0110000001000011, //4
    0b0011000001000111, //5
    0b0011100001000111, //6
    0b0111000000000000, //7
    0b0111100001000111, //8
    0b0111000001000111 //9
    ]


    function send (value:number):void
    {
        pins.i2cWriteNumber(i2c_addr, value, NumberFormat.UInt8BE); //start oscillator
    }

    function send_number ():void
    {
        send(0x80); //display off
        pins.i2cWriteBuffer(i2c_addr, _buf);
        send(0x81); //display on
    }

    function set_brighntess (value: number):void
    {
        send (0xe0 | value);
    }

    /**
     * Initialize display
     * @param addr I2C address. eg: 113
     */
    //% weight=100 block="Init. I2C address %addr"
    export function init(addr: number): void {
        basic.pause(1);
        i2c_addr=addr;
        send(0x21); //start oscillator
        set_brighntess(8);
        send(0x80); //display off
    }


    /**
    * Brightness
    * @param bright from 0 to 15. eg: 10
    */
    //% weight=95 block="Brightness %bright"
    export function set_bright(bright: number): void {
        set_brighntess(bright);
    }

    /**
    * Display number
    * @param val to dispaly
    */
    //% weight=90 block="Display number %val"
    export function dis_num(val: number): void {
        let dlugosc:number //długość liczby
        _buf [0] = 0x02 //adres w pamieci ram HT odp. pierwszemu wyświetlaczowi
        dlugosc = val.toString().length
        if (dlugosc<5) {
            _buf[1] = (cyfra[Math.floor(val / 1000)] >> 8) & 0xff;  //np. dzielenie bez reszty 3567/1000 = 3
            _buf[2] = cyfra[Math.floor(val / 1000)] & 0xff;
            _buf[3] = (cyfra[Math.floor((val % 1000) / 100)] >> 8) & 0xff; //bierzemy 8 starszych bitów
            _buf[4] = cyfra[Math.floor((val % 1000) / 100)] & 0xff; //bierzemy 8 młodszych bitów
            _buf[5] = (cyfra[Math.floor((val % 100) / 10)] >> 8) & 0xff; //bierzemy 8 starszych bitów
            _buf[6] = cyfra[Math.floor((val % 100) / 10)] & 0xff; //bierzemy 8 młodszych bitów
            _buf[7] = (cyfra[val % 10] >> 8) & 0xff; //bierzemy 8 starszych bitów
            _buf[8] = cyfra[val % 10] & 0xff; //bierzemy 8 młodszych bitów
            send_number();
        } else {
            let znaki_liczby: number[] = [];
            let liczba_string: string;
            liczba_string=val.toString();
            for (let i=0; i<dlugosc; i++){
                znaki_liczby.push(parseInt(liczba_string.substr(i,1)));
                
            }
            while (1) {
                for (let i = 0; i < dlugosc - 3; i++) {
                    _buf[1] = (cyfra[znaki_liczby[i]] >> 8) & 0xff;
                    _buf[2] = cyfra[znaki_liczby[i]] & 0xff;
                    _buf[3] = (cyfra[znaki_liczby[i + 1]] >> 8) & 0xff;
                    _buf[4] = cyfra[znaki_liczby[i + 1]] & 0xff;
                    _buf[5] = (cyfra[znaki_liczby[i + 2]] >> 8) & 0xff;
                    _buf[6] = cyfra[znaki_liczby[i + 2]] & 0xff;
                    _buf[7] = (cyfra[znaki_liczby[i + 3]] >> 8) & 0xff;
                    _buf[8] = cyfra[znaki_liczby[i + 3]] & 0xff
                    send_number();
                    basic.pause(500);
                }
                basic.pause(1000);
            }
            
        }
        
        
        //console.log(Math.floor(val / 1000));
        //console.log(Math.floor((val % 1000) / 100));
        //console.log(Math.floor((val % 100) / 10));
        //console.log(val % 10);
    }


}
