interface StationTileProps {
    updated: string;
    openModal: CallableFunction;
}

export default function Footer({ updated, openModal }: StationTileProps) {
    return (
        <section className="footer">
            <div className="footer-updated">Letztes Preisupdate: {updated} Uhr</div>

            <div className="footer-disclaimer">
                <span>Bereitstellung der Preise duch: </span>
                <a href="https://creativecommons.tankerkoenig.de/">www.creativecommons.tankerkoenig.de</a>
            </div>

            <div className="footer-links">
                <span className="footer-links-label" onClick={() => openModal('imprint')}>
                    Impressum
                </span>
                <span> | </span>
                <span className="footer-links-label" onClick={() => openModal('datpro')}>
                    Datenschutz
                </span>
            </div>

            <span>© 2024</span>
        </section>
    );
}
