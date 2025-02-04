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
                        <span>Website: </span>
                        <a className="mail-link" href="https://mike-meyer.dev">
                            mike-meyer.dev
                        </a>
                        <br />
                        <span>E-Mail: </span>
                        <a className="mail-link" href="mailto:contact@mike-meyer.dev?subject=Tanken in Goslar">
                            contact@mike-meyer.dev
                        </a>
                        <br />
                        Telefon: +49 (0) 151 255 267 04
                    </p>
                    <br />
                </div>
            </div>
        </div>
    );
}
