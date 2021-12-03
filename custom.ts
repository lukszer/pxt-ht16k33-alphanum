
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
    let i2c_addr: number;
    
    function send (value:number)
    {
        pins.i2cWriteNumber(i2c_addr, value, NumberFormat.UInt8BE); //start oscillator
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

    }

}
