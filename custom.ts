
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
    let symbole_ascii: number[] = [];

    function set_ascii():void //przypisanie do kodów ascii odpowednich wartości bitowych
    {
        for (let i=0;i<128;i++){ //wszystko wypelniamy 0 - jeśli brak zdefiniowanego symbolu to wyświetlacz nie zapali się
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
        symbole_ascii[98] = 0b0001100001000110; // b + 0x0a 2 bity
        symbole_ascii[99] = 0b0001100001000100; // c - kod bitowy odpowiada wielkim literom
        symbole_ascii[100] = 0b0111000000101100; // d
        symbole_ascii[101] = 0b0001100001000111; // e
        symbole_ascii[102] = 0b0001100001000011; // f
        symbole_ascii[103] = 0b0011100001000101; // g
        symbole_ascii[104] = 0b0110100001000011; // h
        symbole_ascii[105] = 0b0001000000101100; // i
        symbole_ascii[106] = 0b0111000000010100; // j
        symbole_ascii[107] = 0b0000000000101000; // k + 0x0a 2 bity
        symbole_ascii[108] = 0b0000100001000100; // l
        symbole_ascii[109] = 0b1110100001000000; // m + 0x0a 1 bit
        symbole_ascii[110] = 0b1110100001000000; // n + 0x0a 1 bit
        symbole_ascii[111] = 0b0111100001000100; // o
        symbole_ascii[112] = 0b0101100001000011; // p
        symbole_ascii[113] = 0b0111100001000100; // q + 0x0a 1 bit
        symbole_ascii[114] = 0b0101100001000011; // r + 0x0a 1 bit
        symbole_ascii[115] = 0b0011000001000111; // s
        symbole_ascii[116] = 0b0001000000101000; // t
        symbole_ascii[117] = 0b0110100001000100; // u
        symbole_ascii[118] = 0b1110000000000000; // v + 0x0a 1 bit
        symbole_ascii[119] = 0b0110100001010000; // w + 0x0a 1 bit
        symbole_ascii[120] = 0b1000000000010000; // x + 0x0a 2 bit
        symbole_ascii[121] = 0b1000000000001000; // y + 0x0a 1 bit
        symbole_ascii[122] = 0b0001000000010100; // z + 0x0a 1 bit
    }

    function send (value:number):void
    {
        pins.i2cWriteNumber(i2c_addr, value, NumberFormat.UInt8BE); 
    }

    function send_number ():void
    {
        send(0x80); //display off
        pins.i2cWriteBuffer(i2c_addr, _buf);
        send(0x81); //display on
    }

    function set_brighntess (value: number):void
    {
        send (0xe0 | value); //suma bitowa value=0..15
    }

    //wyświetlacz jest błędnie skonstruowany, ukośne ledy zapalane są
    //na adresie 0x0a i 0x0b
    function set_bledne_litery(litera: string, nr: number):void
    {
        if (litera == "b" || litera == "k" || litera == "x") {
            switch (nr) {
                case 1: 
                    _buf[9] = _buf[9] | 0b00011000; //suma bitowa ponieważ na raz może być wyświetlonych wiecej znaków z błędami
                    _buf[10] = _buf[10] | 0b00000000;
                    break;
                case 2:
                    _buf[9] = _buf[9] | 0b01000000;
                    _buf[10] = _buf[10] | 0b01000000;
                    break;
                case 3:
                    _buf[9] = _buf[9] | 0b00100000;
                    _buf[10] = _buf[10] | 0b00000010;
                    break;
                case 4:
                    _buf[9] = _buf[9] | 0b00000000;
                    _buf[10] = _buf[10] | 0b00000101;
                    break;
            }
        }
    
        if (litera == "m" || litera == "y" || litera == "z") {
            switch (nr) {
                case 1:
                    _buf[9] = _buf[9] | 0b00010000; //suma bitowa ponieważ na raz może być wyświetlonych wiecej znaków z błędami
                    _buf[10] = _buf[10] | 0b00000000;
                    break;
                case 2:
                    _buf[9] = _buf[9] | 0b01000000;
                    _buf[10] = _buf[10] | 0b00000000;
                    break;
                case 3:
                    _buf[9] = _buf[9] | 0b00100000;
                    _buf[10] = _buf[10] | 0b00000000;
                    break;
                case 4:
                    _buf[9] = _buf[9] | 0b00000000;
                    _buf[10] = _buf[10] | 0b00000100;
                    break;
            }
        }
        if (litera == "n" || litera== "q" || litera == "r" || litera=="v" || litera=="w") {
            switch (nr) {
                case 1:
                    _buf[9] = _buf[9] | 0b00001000; //suma bitowa ponieważ na raz może być wyświetlonych wiecej znaków z błędami
                    _buf[10] = _buf[10] | 0b00000000;
                    break;
                case 2:
                    _buf[9] = _buf[9] | 0b00000000;
                    _buf[10] = _buf[10] | 0b01000000;
                    break;
                case 3:
                    _buf[9] = _buf[9] | 0b00000000;
                    _buf[10] = _buf[10] | 0b00000010;
                    break;
                case 4:
                    _buf[9] = _buf[9] | 0b00000000;
                    _buf[10] = _buf[10] | 0b00000001;
                    break;
            }
        }
        
    }

    /**
     * Initialize display
     * @param addr I2C address. eg: 113
     */
    //% weight=100 block="Init. I2C address %addr"
    export function init(addr: number): void {
        basic.pause(1);
        set_ascii();
        i2c_addr=addr; //set display address, default 0x71=113
        send(0x21); //start oscillator
        set_brighntess(10); //default brightness
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
        let dlugosc:number //ilość znaków liczby
        let liczba_string: string; //zmienna pzechowująca liczbę w postaci stringu
        _buf [0] = 0x02 //adres w pamieci ram HT odp. pierwszemu wyświetlaczowi
        liczba_string = val.toString(); //zamiana liczby na string
        dlugosc = liczba_string.length  //określenie długości stringa
        if (dlugosc<5) //jeżeli ilość znaków 4 lub mniej to bez scrolla
        {
            switch (dlugosc){ //dodaanie na początku, żeby krótsze liczby wyświetlały się od prawego segmentu
                case 1: liczba_string ="   " + liczba_string; break;
                case 2: liczba_string ="  " + liczba_string; break;
                case 3: liczba_string =" " + liczba_string; break;
            }
            for (let i=0; i<4; i++)
            {
                _buf[i * 2 + 1] = (symbole_ascii[liczba_string.substr(i, 1).charCodeAt(0)] >> 8) & 0xff; //bierzemy 8 starszych bitów
                _buf[i * 2 + 2] = symbole_ascii[liczba_string.substr(i, 1).charCodeAt(0)] & 0xff; //bierzemy 8 młodszych bitów
            }
            send_number();
        } else { //jeżeli długość większa niż 4, to scroll
            liczba_string = "   " + liczba_string + "   "; //dodanie na początku i końcu pustych znaków
            
            for (let i = 0; i < dlugosc - 3+3+3; i++) { //+3+3, bo na poczatku i koncu dopisane znaki puste
                for (let j = 0; j < 4; j++) {
                    _buf[j * 2 + 1] = (symbole_ascii[liczba_string.substr(i+j, 1).charCodeAt(0)] >> 8) & 0xff; //bierzemy 8 starszych bitów
                    _buf[j * 2 + 2] = symbole_ascii[liczba_string.substr(i+j, 1).charCodeAt(0)] & 0xff; //bierzemy 8 młodszych bitów
                }
                
                send_number();
                basic.pause(400);  //scroll speed

            } 
        }
        
    }

    /**
    * Display string
    * @param val to dispaly
    */
    //% weight=85 block="Display string %val"
    export function dis_string(val: string): void {
        let dlugosc: number; //długość stringa  
        _buf[0] = 0x02;
        val = val.toLowerCase(); // ustawienie stringa na małe literki
        dlugosc = val.length;
        if (dlugosc < 5) {
            for (let i=0;i<4;i++){
                _buf[i*2+1] = (symbole_ascii[val.substr(i, 1).charCodeAt(0)] >> 8) & 0xff;
                _buf[i*2+2] = symbole_ascii[val.substr(i, 1).charCodeAt(0)] & 0xff;
                if (val.substr(i, 1) == "b" || val.substr(i, 1) == "k" || val.substr(i, 1) == "m" || val.substr(i, 1) == "n" || val.substr(i, 1) == "q" || val.substr(i, 1) == "r" || val.substr(i, 1) == "v" || val.substr(i, 1) == "w" || val.substr(i, 1) == "x" || val.substr(i, 1) == "y" || val.substr(i, 1) == "z") {
                    set_bledne_litery(val.substr(i, 1), i+1);
                }
            }
            send_number();
        } else{
            val = "   " + val + "   "; //dodanie na końcu i początku pustych znaków
            for (let i = 0; i < dlugosc - 3 + 3 + 3; i++) { //+3+3, bo na poczatku i koncu dopisane znaki puste
                _buf[9]=0; //czyszczenie ukośnych ledów
                _buf[10]=0; // czyszczenie ukośnych ledów
                send_number();
                for (let j = 0; j < 4; j++) {
                    _buf[j * 2 + 1] = (symbole_ascii[val.substr(i + j, 1).charCodeAt(0)] >> 8) & 0xff; //bierzemy 8 starszych bitów
                    _buf[j * 2 + 2] = symbole_ascii[val.substr(i + j, 1).charCodeAt(0)] & 0xff; //bierzemy 8 młodszych bitów
                    if (val.substr(i+j, 1) == "b" || val.substr(i+j, 1) == "k" || val.substr(i+j, 1) == "m" || val.substr(i+j, 1) == "n" || val.substr(i+j, 1) == "q" || val.substr(i+j, 1) == "r" || val.substr(i+j, 1) == "v" || val.substr(i+j, 1) == "w" || val.substr(i+j, 1) == "x" || val.substr(i+j, 1) == "y" || val.substr(i+j, 1) == "z") {
                        set_bledne_litery(val.substr(i+j, 1), j+1);
                    }
                }
                send_number();
                basic.pause(400);  //scroll speed
            }
        
        //console.log(Math.floor((val % 1000) / 100));
        //console.log(Math.floor((val % 100) / 10));
        //console.log(val % 10);
        }
    }

    /**
    * Display colon :
    * @param val to dispaly
    */
    //% weight=80 block="Colon %val"
    export function dis_colon(val: string): void {
        _buf[0] = 0x02;

        _buf[9] = _buf[9] | 0b10000001;
        _buf[10] = _buf[10] | 0b00000000;
        send_number();
        
        pause(5000);
        _buf[9] = _buf[9] | 0b00000000;
        _buf[10] = _buf[10] | 0b00000000;
        send_number();

        //console.log(Math.floor((val % 1000) / 100));
        //console.log(Math.floor((val % 100) / 10));
        //console.log(val % 10);
        
    }


}
