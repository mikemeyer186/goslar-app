interface ToolbarProps {
    activeSelection: string;
    onFuelSelection: CallableFunction;
    onSliderMove: VoidFunction;
    showOnlyOpenStations: boolean;
}

export default function Toolbar({ activeSelection, onFuelSelection, onSliderMove, showOnlyOpenStations }: ToolbarProps) {
    return (
        <section className="toolbar">
            <div>
                <button className={`btn-selection ${activeSelection === 'diesel' ? 'btn-active' : ''}`} onClick={() => onFuelSelection('diesel')}>
                    Diesel
                </button>
                <button className={`btn-selection ${activeSelection === 'e5' ? 'btn-active' : ''}`} onClick={() => onFuelSelection('e5')}>
                    E5
                </button>
                <button className={`btn-selection ${activeSelection === 'e10' ? 'btn-active' : ''}`} onClick={() => onFuelSelection('e10')}>
                    E10
                </button>
            </div>
            <div>
                {/* <span className="toolbar-slider-label">Nur offene Tankstellen anzeigen</span> */}
                <div className={`toolbar-slider-toggle ${!showOnlyOpenStations ? 'slider-inactive' : ''}`} onClick={onSliderMove}>
                    <div className="toolbar-slider-knob"></div>
                </div>
            </div>
        </section>
    );
}
