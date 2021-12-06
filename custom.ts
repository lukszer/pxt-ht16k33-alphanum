
/**
* Użyj tego pliku, aby zdefiniować niestandardowe funkcje i bloki.
* Czytaj więcej na https://makecode.microbit.org/blocks/custom
*/

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
    0b0111000001000111, //9
    0b0000000000000000  // null
    ]

    let symbole_ascii: number[] = [];

    function set_ascii():void
    {
        for (let i=0;i<128;i++){
            symbole_ascii.push(0);
        }
        symbole_ascii[43] = 0b0000000000101011; // +
        symbole_ascii[45] = 0b0000000000000011; // -
        symbole_ascii[48] = 0b0111100001000100; // 0
        symbole_ascii[49] = 0b0110000000000000; // 1
        symbole_ascii[50] = 0b0101100000000111; // 2
        symbole_ascii[51] = 0b0111000000000111; // 3
        symbole_ascii[52] = 0b0110000001000011; // 4
        symbole_ascii[53] = 0b0011000001000111; // 5
        symbole_ascii[54] = 0b0011100001000111; // 6
        symbole_ascii[55] = 0b0111000000000000; // 7
        symbole_ascii[56] = 0b0111100001000111; // 8
        symbole_ascii[57] = 0b0111000001000111; // 9
        symbole_ascii[97] = 0b0111100001000011; // a - tylko małe litery, bo cały string zamieniany na małe litery
        symbole_ascii[98] = 0b0110000000000000; // b - wyświetlane są i tak wielkie litery
        symbole_ascii[99] = 0b0001100001000100; // c
        symbole_ascii[100] = 0b0111000000101100; // d
        symbole_ascii[101] = 0b0001100001000111; // e
        symbole_ascii[102] = 0b0001100001000011; // f
        symbole_ascii[103] = 0b0011100001000101; // g
        symbole_ascii[104] = 0b0110100001000011; // h
        symbole_ascii[105] = 97; // i
        symbole_ascii[106] = 97; // j
        symbole_ascii[107] = 97; // k
        symbole_ascii[108] = 97; // l
        symbole_ascii[109] = 97; // m
        symbole_ascii[110] = 97; // n
        symbole_ascii[111] = 97; // o
        symbole_ascii[112] = 97; // p
        symbole_ascii[113] = 97; // q
        symbole_ascii[114] = 97; // r
        symbole_ascii[115] = 97; // s
        symbole_ascii[116] = 97; // t
        symbole_ascii[117] = 97; // u
        symbole_ascii[118] = 97; // v
        symbole_ascii[119] = 97; // w
        symbole_ascii[120] = 97; // x
        symbole_ascii[121] = 97; // y
        symbole_ascii[122] = 97; // z
    }

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
            liczba_string=val.toString(); //zamiana liczby na string
            
            for (let i=0;i<3; i++){ //wpisanie na początek 3 pustych znaków
                znaki_liczby.push(10);
            }         
            for (let i=0; i<dlugosc; i++){
                znaki_liczby.push(parseInt(liczba_string.substr(i,1))); //zamiana stringa na int i wpisnie kolejnych cyfr liczby do tablicy   
            }
            for (let i = 0; i < 3; i++) { //wpisanie na końcu 3 pustych znaków
                znaki_liczby.push(10);
            }

            for (let i = 0; i < dlugosc - 3+3+3; i++) { //+3+3, bo na poczatku i koncu dopisane znaki puste
                _buf[1] = (cyfra[znaki_liczby[i]] >> 8) & 0xff;
                _buf[2] = cyfra[znaki_liczby[i]] & 0xff;
                _buf[3] = (cyfra[znaki_liczby[i + 1]] >> 8) & 0xff;
                _buf[4] = cyfra[znaki_liczby[i + 1]] & 0xff;
                _buf[5] = (cyfra[znaki_liczby[i + 2]] >> 8) & 0xff;
                _buf[6] = cyfra[znaki_liczby[i + 2]] & 0xff;
                _buf[7] = (cyfra[znaki_liczby[i + 3]] >> 8) & 0xff;
                _buf[8] = cyfra[znaki_liczby[i + 3]] & 0xff
                send_number();
                basic.pause(600);
            } 
        }
        
        
        //console.log(Math.floor(val / 1000));
        //console.log(Math.floor((val % 1000) / 100));
        //console.log(Math.floor((val % 100) / 10));
        //console.log(val % 10);
    }



    /**
    * Display string
    * @param val to dispaly
    */
    //% weight=85 block="Display string %val"
    export function dis_string(val: string): void {
        let dlugosc: number; //długość liczby   
        set_ascii();
        _buf[0] = 0x02;
        val = val.toLowerCase(); // ustawienie stringu na małe literki
        dlugosc = val.length;
        if (dlugosc < 5) {
            for (let i=0;i<4;i++){
                _buf[i+1] = (symbole_ascii[val.substr(i, 1).charCodeAt(0)] >> 8) & 0xff;
                _buf[i+2] = symbole_ascii[val.substr(i, 1).charCodeAt(0)] & 0xff;
                console.log(val.substr(i, 1).charCodeAt(0));
            }
            send_number();
        }
        
        console.log(_buf[1]);
        console.log(_buf[2]);
        //console.log(Math.floor((val % 1000) / 100));
        //console.log(Math.floor((val % 100) / 10));
        //console.log(val % 10);
    }

}
