/**
 * Options for device connection.
 * @interface ISerialOptions
 */
export interface ISerialOptions {
  /**
   * A positive, non-zero value indicating the baud rate at which serial communication should be established.
   * @type {number}
   */
  baudRate: number;
}

/**
 * Template to define Transport class which can be consumed by the ESPLoader.
 * A Webserial reference implementation is found at src/transport/WebSerialTransport.ts
 */
export abstract class AbstractTransport {
  public abstract tracing: boolean;
  public abstract slipReaderEnabled: boolean;

  public abstract getInfo(): string;

  public abstract getPID(): number | undefined;

  public abstract trace(message: string): void;

  public abstract returnTrace(): Promise<void>;

  public abstract hexify(s: Uint8Array): string;

  public abstract hexConvert(uint8Array: Uint8Array, autoSplit?: boolean): string;

  public abstract slipWriter(data: Uint8Array): Uint8Array;

  public abstract write(data: Uint8Array): Promise<void>;

  public abstract slipReader(data: Uint8Array): Uint8Array;

  public abstract read(timeout?: number, minData?: number): Promise<Uint8Array>;

  public abstract rawRead(timeout?: number): Promise<Uint8Array>;

  public abstract setRTS(state: boolean): Promise<void>;

  public abstract setDTR(state: boolean): Promise<void>;

  public abstract connect(serialOptions: ISerialOptions): Promise<void>;

  public abstract disconnect(): Promise<void>;
}
