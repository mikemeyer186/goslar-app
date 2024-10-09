interface ToolbarProps {
    activeSelection: string;
    onFuelSelection: CallableFunction;
}

export default function Toolbar({ activeSelection, onFuelSelection }: ToolbarProps) {
    return (
        <section className="toolbar">
            <button className={`btn-selection ${activeSelection === 'diesel' ? 'btn-active' : ''}`} onClick={() => onFuelSelection('diesel')}>
                Diesel
            </button>
            <button className={`btn-selection ${activeSelection === 'e5' ? 'btn-active' : ''}`} onClick={() => onFuelSelection('e5')}>
                E5
            </button>
            <button className={`btn-selection ${activeSelection === 'e10' ? 'btn-active' : ''}`} onClick={() => onFuelSelection('e10')}>
                E10
            </button>
        </section>
    );
}
