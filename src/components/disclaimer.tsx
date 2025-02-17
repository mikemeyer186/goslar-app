interface ImprintTileProps {
    closeModal: CallableFunction;
}

export default function Disclaimer({ closeModal }: ImprintTileProps) {
    return (
        <div className="scroll-container">
            <div className="close-icon" onClick={() => closeModal('disclaimer')}>
                Zurück
            </div>

            <div className="disclaimer-container">
                <div>
                    <h1>Haftungsausschluss</h1>

                    <p>
                        Die Website (www.tanken-in-goslar.de) dient ausschließlich zu Informationszwecken und stellt keine rechtsverbindlichen
                        Angebote dar. Die angezeigten Kraftstoffpreise werden von Dritten (Tankerkönig) bereitgestellt. Trotz sorgfältiger Recherche
                        übernehmen wir keine Gewähr für die Richtigkeit, Vollständigkeit oder Aktualität der dargestellten Informationen. Wir sind
                        weder verantwortlich für die Preisgestaltung noch für sonstige Angebote der jeweiligen Tankstellen und distanzieren uns
                        ausdrücklich von Inhalten, auf die durch externe Links verwiesen wird. Jegliche Haftung für Schäden, die direkt oder indirekt
                        aus der Nutzung dieser Website entstehen, wird ausgeschlossen, soweit gesetzlich zulässig. Bitte beachten Sie, dass die
                        endgültigen und verbindlichen Preise stets vor Ort an der Tankstelle gelten. Sollten Sie Ungenauigkeiten bemerken, teilen Sie
                        uns diese gerne mit, damit entsprechende Anpassungen schnellstmöglich vorgenommen werden können.
                    </p>

                    <div className="disclaimer-footer">
                        <span>Bereitstellung der Preise duch: </span>
                        <a href="https://creativecommons.tankerkoenig.de/">www.creativecommons.tankerkoenig.de</a>
                    </div>
                    <br />
                </div>
            </div>
        </div>
    );
}
