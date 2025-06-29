

import { useEffect } from "react";

type ExtendedCustomComboBoxProps<T> = {
    dataSource: T[];
    textSelector: (item: T) => string;
    valueSelector: (item: T) => string | number;
    selectedValue?: string | number;
    onChange?: (value: string | number | T) => void;
    disabled?: boolean;
    required?: boolean;
}

//this shitty forced-type is like the where in generics of C#
const ExtendedCustomComboBox = <T extends object>(props: ExtendedCustomComboBoxProps<T>) => {

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
                    <option key={String(props.valueSelector(item))} value={props.valueSelector(item) as string | number}>
                        {props.textSelector(item) as string}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ExtendedCustomComboBox;
