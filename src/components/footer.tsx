interface StationTileProps {
    updated: string;
}

export default function Footer({ updated }: StationTileProps) {
    return (
        <section className="footer">
            <div className="footer-updated">Letztes Preisupdate: {updated} Uhr</div>

            <div className="footer-disclaimer">
                <span>Bereitstellung der Preise duch: </span>
                <a href="https://creativecommons.tankerkoenig.de/">www.creativecommons.tankerkoenig.de</a>
            </div>

            <div className="footer-links">
                <span>Impressum</span>
                <span> | </span>
                <span>Datenschutz</span>
            </div>

            <span>© 2024</span>
        </section>
    );
}
