type EditInputProp = {
  inputFor: string;
  inputText: string;
  inputType: string;
  inputId: string;
  inputName: string;
  inputValue?: string;
  defaultValue?: string;
  required?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};


type EditTextAreaProp = {
  inputFor: string;
  inputText: string;
  inputId: string;
  inputName: string;
  inputValue?: string;
  defaultValue?: string;
  required?: boolean
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
};

type EditSelectProp = {
  label: string;
  name: string;
  id: string;
  defaultValue?: string;
  data: PlaceData[] | undefined
  handleStateChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

type ViewInputProp = {
  heading: string;
  text: string;
}

function EditableInputFIeld(inputProp: EditInputProp) {
  return (
    <>
      <div className="my-3">
        <label htmlFor={inputProp.inputFor} className="text-[#030D41]">{inputProp.inputText}</label>
        <br />
        <input
          type={inputProp.inputType}
          id={inputProp.inputId}
          name={inputProp.inputName}
          // will be required by default, it will be turned off when the component is invoked
          required={inputProp.required}
          className="px-2 py-2 border border-input-border-color w-full rounded"
          value={inputProp.inputValue}
          defaultValue={inputProp.defaultValue}
          onChange={inputProp.onChange}
        />
        {/* Render error message if it exists */}
        {inputProp.error && <p style={{ color: 'red' }}>{inputProp.error}</p>}
      
      </div>
    </>
  );
}

function EditableTextAreaFIeld(inputProp: EditTextAreaProp) {
  return (
    <>
      <div className="my-3">
        <label htmlFor={inputProp.inputFor} className="text-[#030D41]">{inputProp.inputText}</label>
        <br />
        <textarea
          id={inputProp.inputId}
          name={inputProp.inputName}
          // will be required by default, it will be turned off when the component is invoked
          required={inputProp.required}
          className="px-2 py-2 border border-input-border-color w-full rounded"
          value={inputProp.inputValue}
          defaultValue={inputProp.defaultValue}
          onChange={inputProp.onChange}
          rows={5}
        ></textarea>
        {/* Render error message if it exists */}
        {inputProp.error && <p style={{ color: 'red' }}>{inputProp.error}</p>}

      </div>
    </>
  );
}


function EditableSelectField(inputProp: EditSelectProp) {
  return (
    <>
      <label htmlFor={inputProp.name} className="text-[#030D41]">{inputProp.label}</label>
      <select name={inputProp.name} id={inputProp.id} onChange={inputProp.handleStateChange} defaultValue={inputProp.defaultValue} className="px-2 py-2 border border-input-border-color w-full rounded min-h-8" required >
        <option value="">---</option>
        {
          inputProp.data?.map((place) => (
            <option key={place.id} value={place.id} >{place.name}</option>
          ))
        }

      </select>
    </>
  )
}


function ViewingInputField(inputProp: ViewInputProp) {
  return (
    <>
      <div className="mb-3">
        <h2 className="mb-1 text-[#030D41]">{inputProp.heading}</h2>
        <div className="px-2 py-2 border border-input-border-color w-full rounded min-h-8">
          {inputProp.text}
        </div>
      </div>
    </>
  )
}


export { EditableInputFIeld, EditableTextAreaFIeld, EditableSelectField, ViewingInputField };