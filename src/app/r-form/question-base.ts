export class QuestionBase<T> {
  /** Type of the question */
  value: T;
  /** key of the question in the form */
  key: string;
  /** Label or the placeholder of the question in the form */
  label: string;
  /** Is the question required or not ? */
  required: boolean;
  /** order of the question in the form */
  order: number;
  /** Type of the question (textbox,area,dropdown,checkbox...) */
  controlType: string;
  /** Type of the question (text,number...) */
  type: string;
  /** Options to choose in the case of a dropdown for example */
  options: {key: string, value: string}[];
  /**
   * Construct each question from the options below
   * @param options Options of the question
   */
  constructor(options: {
      value?: T;
      key?: string;
      label?: string;
      required?: boolean;
      order?: number;
      controlType?: string;
      type?: string;
      options?: {key: string, value: string}[];
    } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.options = options.options || [];
  }
}
