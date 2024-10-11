type ActionButtonProp = {
    buttonText: string;
    buttonBgColor: "bg-main-color" | "bg-[#f00]";
    onClickFn: ()=>{};
};


export function ActionButton(buttonProp: ActionButtonProp) {
    return (
        <div className="flex mt-4 w-3/4 text-center">
            <button
                onClick={buttonProp.onClickFn} className={` ${buttonProp.buttonBgColor} px-3 py-3 cursor-pointer rounded-md text-white w-full`}
            >
                {buttonProp.buttonText.toUpperCase()}
            </button>
        </div>
    );
}


