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
    <div className="mb-5">
      <label htmlFor={inputProp.inputFor} className="block mb-1 text-sm font-medium text-gray-700">
        {inputProp.inputText}
      </label>
      <input
        type={inputProp.inputType}
        id={inputProp.inputId}
        name={inputProp.inputName}
        required={inputProp.required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-main-color focus:border-main-color text-sm"
        value={inputProp.inputValue}
        defaultValue={inputProp.defaultValue}
        onChange={inputProp.onChange}
      />
      {inputProp.error && <p className="text-red-500 text-xs mt-1">{inputProp.error}</p>}
    </div>
  );
}


function EditableTextAreaFIeld(inputProp: EditTextAreaProp) {
  return (
    <div className="mb-5">
      <label htmlFor={inputProp.inputFor} className="block mb-1 text-sm font-medium text-gray-700">
        {inputProp.inputText}
      </label>
      <textarea
        id={inputProp.inputId}
        name={inputProp.inputName}
        required={inputProp.required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-main-color focus:border-main-color text-sm"
        value={inputProp.inputValue}
        defaultValue={inputProp.defaultValue}
        onChange={inputProp.onChange}
        rows={5}
      ></textarea>
      {inputProp.error && <p className="text-red-500 text-xs mt-1">{inputProp.error}</p>}
    </div>
  );
}



function EditableSelectField(inputProp: EditSelectProp) {
  return (
    <div className="mb-5">
      <label htmlFor={inputProp.id} className="block mb-1 text-sm font-medium text-gray-700">
        {inputProp.label}
      </label>
      <select
        id={inputProp.id}
        name={inputProp.name}
        onChange={inputProp.handleStateChange}
        defaultValue={inputProp.defaultValue}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-main-color focus:border-main-color text-sm"
      >
        <option value="">---</option>
        {inputProp.data?.map((place) => (
          <option key={place.id} value={place.id}>
            {place.name}
          </option>
        ))}
      </select>
      {inputProp.error && <p className="text-red-500 text-xs mt-1">{inputProp.error}</p>}
    </div>
  );
}



function ViewingInputField(inputProp: ViewInputProp) {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-500">{inputProp.heading}</p>
      <div className="text-[15px] text-gray-800 font-medium bg-gray-50 px-3 py-2 rounded border border-gray-200 mt-1">
        {inputProp.text || <span className="text-gray-400 italic">Not provided</span>}
      </div>
    </div>
  );
}



export { EditableInputFIeld, EditableTextAreaFIeld, EditableSelectField, ViewingInputField };