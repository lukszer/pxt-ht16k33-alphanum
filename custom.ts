
/**
* Użyj tego pliku, aby zdefiniować niestandardowe funkcje i bloki.
* Czytaj więcej na https://makecode.microbit.org/blocks/custom
*/

enum znaki {
    a = 0b0111100001000011,
    b = 0b0110000000000000,
    c = 0b0001100001000011
}

/**
 * Alphanumeric display blocks
 */
//% weight=80 color=#fc0345 icon="\uf2db"
namespace HT16K33 {
    let _buf=pins.createBuffer(11);
    let i2c_addr: number; //device address - Seeed 0x71=113
    let start_display_ram: number;
    let cyfra: number[] = [0b0111100001000100, 0b0110000000000000]


    function send (value:number):void
    {
        pins.i2cWriteNumber(i2c_addr, value, NumberFormat.UInt8BE); //start oscillator
    }

    function send_number ():void
    {
        pins.i2cWriteBuffer(i2c_addr, _buf);
    }

    function set_brighntess (value: number):void
    {
        send (0xe0 | value);
    }

    /**
     * Initialize display
     * @param addr I2C address. eg: 113
     */
    //% block="Init. I2C address %addr"
    export function init(addr: number): void {
        basic.pause(1);
        i2c_addr=addr;
        send(0x21); //start oscillator
        set_brighntess(8);
        send(0x80); //display off
    }

    /**
    * Display number
    * @param val to dispaly
    */
    //% block="Display number %val"
    export function dis_num(val: number): void {
        _buf [0] = 0x02 //adres w pamieci ram HT odp. pierwszemu wyświetlaczowi
        _buf [1] = (cyfra[Math.round(val/1000)]>>8) & 0xff;
        _buf [2] = cyfra[Math.round(val / 1000)] & 0xff;
        _buf[3] = (cyfra[Math.round(val / 100)] >> 8) & 0xff;
        _buf[4] = cyfra[Math.round(val / 100)] & 0xff;
        basic.pause(2000);
        console.log(_buf[0]);
        console.log(_buf[1]);
        console.log(_buf[2]);
    }


}
