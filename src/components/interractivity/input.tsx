type InputProp = {
  inputFor: string;
  inputText: string;
  inputType: string;
  inputId: string;
  inputName: string;
  inputValue?: string;
  required?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function InputFIeld(inputProp: InputProp) {
  return (
    <>
      <div className="my-3">
        <label htmlFor={inputProp.inputFor}>{inputProp.inputText}</label>
        <br />
        <input
          type={inputProp.inputType}
          id={inputProp.inputId}
          name={inputProp.inputName}
          // will be required by default, it will be turned off when the component is invoked
          required={inputProp.required}
          className="px-2 py-2 border border-[#AEB1B9] w-full rounded"
          value={inputProp.inputValue}
          onChange={inputProp.onChange}
        />
      </div>
    </>
  );
}

export default InputFIeld;