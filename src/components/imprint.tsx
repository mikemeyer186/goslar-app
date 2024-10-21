interface ImprintTileProps {
    closeModal: CallableFunction;
}

export default function Imprint({ closeModal }: ImprintTileProps) {
    return (
        <div className="scroll-container">
            <div className="close-icon" onClick={() => closeModal('imprint')}>
                Schließen
            </div>

            <div className="imprint-container">
                <div>
                    <h1>Impressum</h1>

                    <h3>Angaben gemäß § 5 TMG</h3>

                    <div>
                        <p>
                            Mike Meyer
                            <br />
                            Claustorwall 9c
                            <br />
                            38640 Goslar
                            <br />
                            <br />
                        </p>
                    </div>

                    <h3>Kontakt</h3>
                    <p>
                        Telefon: +49 (0) 151 255 267 04
                        <br />
                        <span>E-Mail: </span>
                        <a className="mail-link" href="mailto:contact@mike-meyer.dev?subject=Goslar App">
                            contact@mike-meyer.dev
                        </a>
                    </p>

                    <p>
                        Quelle: <a href="https://www.e-recht24.de">eRecht24</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
