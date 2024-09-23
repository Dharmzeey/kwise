type InputProp = {
  inputFor: string;
  inputText: string;
  inputType: string;
  inputId: string;
  inputName: string;
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
          required
          className="px-2 py-2 border border-[#AEB1B9] w-full rounded"
        />
      </div>
    </>
  );
}

export default InputFIeld;