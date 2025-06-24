import { useEffect } from "react";

type CustomComboBoxProps<T> = {
    dataSource: T[];
    textField: keyof T;
    valueField: keyof T;
    selectedValue?: string | number;
    onChange?: (value: string | number) => void;
    disabled?: boolean;
    required?: boolean;
}

//this shitty forced-type is like the where in generics of C#
const CustomComboBox = <T extends object>(props: CustomComboBoxProps<T>) => {

    useEffect(() => {
    }, [props.dataSource]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleChange  = props.onChange ? props.onChange : (val : string | number) => {};

    return (
        <div className="custom-combo-box">
            <select
                className="form-select"
                onChange={(e) => {
                    handleChange(e.target.value);
                }}
                value={props.selectedValue}
                disabled={props.disabled}
                required={props.required}
            >
                <option value='' disabled selected={!props.selectedValue}>
                    - Selecciona una opción -
                </option>
                {props.dataSource.length > 0 && props.dataSource.map((item) => (
                    <option key={String(item[props.valueField])} value={item[props.valueField] as string | number}>
                        {item[props.textField] as string}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CustomComboBox;
