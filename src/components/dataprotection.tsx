interface DatProTileProps {
    closeModal: CallableFunction;
}

export default function DataProtection({ closeModal }: DatProTileProps) {
    return (
        <div className="scroll-container">
            <div className="close-icon" onClick={() => closeModal('datpro')}>
                Schließen
            </div>

            <div className="datpro-container">
                <h1>Datenschutz&shy;erkl&auml;rung</h1>
                <h2>1. Datenschutz auf einen Blick</h2>
                <h3>Allgemeine Hinweise</h3>{' '}
                <p>
                    Die folgenden Hinweise geben einen einfachen &Uuml;berblick dar&uuml;ber, was mit Ihren personenbezogenen Daten passiert, wenn Sie
                    diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie pers&ouml;nlich identifiziert werden k&ouml;nnen.
                    Ausf&uuml;hrliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgef&uuml;hrten
                    Datenschutzerkl&auml;rung.
                </p>
                <h3>Datenerfassung auf dieser Website</h3> <h4>Wer ist verantwortlich f&uuml;r die Datenerfassung auf dieser Website?</h4>{' '}
                <p>
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten k&ouml;nnen Sie dem Abschnitt
                    &bdquo;Hinweis zur Verantwortlichen Stelle&ldquo; in dieser Datenschutzerkl&auml;rung entnehmen.
                </p>{' '}
                <h4>Wie erfassen wir Ihre Daten?</h4>{' '}
                <p>
                    Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.&nbsp;B. um Daten handeln, die
                    Sie in ein Kontaktformular eingeben.
                </p>{' '}
                <p>
                    Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor
                    allem technische Daten (z.&nbsp;B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten
                    erfolgt automatisch, sobald Sie diese Website betreten.
                </p>{' '}
                <h4>Wof&uuml;r nutzen wir Ihre Daten?</h4>{' '}
                <p>
                    Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gew&auml;hrleisten. Andere Daten k&ouml;nnen
                    zur Analyse Ihres Nutzerverhaltens verwendet werden. Sofern &uuml;ber die Website Vertr&auml;ge geschlossen oder angebahnt werden
                    k&ouml;nnen, werden die &uuml;bermittelten Daten auch f&uuml;r Vertragsangebote, Bestellungen oder sonstige Auftragsanfragen
                    verarbeitet.
                </p>{' '}
                <h4>Welche Rechte haben Sie bez&uuml;glich Ihrer Daten?</h4>{' '}
                <p>
                    Sie haben jederzeit das Recht, unentgeltlich Auskunft &uuml;ber Herkunft, Empf&auml;nger und Zweck Ihrer gespeicherten
                    personenbezogenen Daten zu erhalten. Sie haben au&szlig;erdem ein Recht, die Berichtigung oder L&ouml;schung dieser Daten zu
                    verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, k&ouml;nnen Sie diese Einwilligung jederzeit f&uuml;r
                    die Zukunft widerrufen. Au&szlig;erdem haben Sie das Recht, unter bestimmten Umst&auml;nden die Einschr&auml;nkung der
                    Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zust&auml;ndigen
                    Aufsichtsbeh&ouml;rde zu.
                </p>{' '}
                <p>Hierzu sowie zu weiteren Fragen zum Thema Datenschutz k&ouml;nnen Sie sich jederzeit an uns wenden.</p>
                <h3>Analyse-Tools und Tools von Dritt&shy;anbietern</h3>{' '}
                <p>
                    Beim Besuch dieser Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das geschieht vor allem mit sogenannten
                    Analyseprogrammen.
                </p>{' '}
                <p>Detaillierte Informationen zu diesen Analyseprogrammen finden Sie in der folgenden Datenschutzerkl&auml;rung.</p>
                <h2>2. Hosting</h2>
                <p>Wir hosten die Inhalte unserer Website bei folgendem Anbieter:</p>
                <h3>All-Inkl</h3>{' '}
                <p>
                    Anbieter ist die ALL-INKL.COM - Neue Medien M&uuml;nnich, Inh. Ren&eacute; M&uuml;nnich, Hauptstra&szlig;e 68, 02742 Friedersdorf
                    (nachfolgend All-Inkl). Details entnehmen Sie der Datenschutzerkl&auml;rung von All-Inkl:{' '}
                    <a href="https://all-inkl.com/datenschutzinformationen/" target="_blank" rel="noopener noreferrer">
                        https://all-inkl.com/datenschutzinformationen/
                    </a>
                    .
                </p>{' '}
                <p>
                    Die Verwendung von All-Inkl erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer
                    m&ouml;glichst zuverl&auml;ssigen Darstellung unserer Website. Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt die
                    Verarbeitung ausschlie&szlig;lich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO und &sect; 25 Abs. 1 TDDDG, soweit die Einwilligung
                    die Speicherung von Cookies oder den Zugriff auf Informationen im Endger&auml;t des Nutzers (z.&nbsp;B. Device-Fingerprinting) im
                    Sinne des TDDDG umfasst. Die Einwilligung ist jederzeit widerrufbar.
                </p>
                <h4>Auftragsverarbeitung</h4>{' '}
                <p>
                    Wir haben einen Vertrag &uuml;ber Auftragsverarbeitung (AVV) zur Nutzung des oben genannten Dienstes geschlossen. Hierbei handelt
                    es sich um einen datenschutzrechtlich vorgeschriebenen Vertrag, der gew&auml;hrleistet, dass dieser die personenbezogenen Daten
                    unserer Websitebesucher nur nach unseren Weisungen und unter Einhaltung der DSGVO verarbeitet.
                </p>
                <h3>Google Firebase (Firestore)</h3>
                <p>
                    Unsere Website nutzt Funktionen von Google Firebase, einem Dienst der Google Ireland Limited („Google“), Gordon House, Barrow
                    Street, Dublin 4, Irland. Konkret verwenden wir den Datenbankdienst Firestore, um Inhalte (z. B. aktualisierte Kraftstoffpreise)
                    in Echtzeit auf unserer Website bereitstellen zu können. Firestore speichert dabei erforderliche Website-Daten auf Servern von
                    Google (Serverstandort ist Frankfurt am Main) und nutzt zur Zwischenspeicherung im Browser eine lokale Datenbank (IndexedDB). Wir
                    nutzen Firestore ausschließlich, um Inhalte unserer Website aktuell anzuzeigen und für eine reibungslose Funktionalität zu sorgen.
                    <strong>Analyse- oder Tracking-Funktionen von Google (z. B. Analytics) kommen nicht zum Einsatz.</strong>
                </p>
                <p>
                    Die Speicherung und Verarbeitung von Daten in Firestore und IndexedDB erfolgt auf Grundlage unseres berechtigten Interesses (Art.
                    6 Abs. 1 lit. f DSGVO) an einer sicheren und effizienten Bereitstellung unserer Website. IndexedDB wird ausschließlich zur
                    technischen Bereitstellung und zwischenspeicherung relevanter Inhalte verwendet und kann von Ihnen – je nach Browser – lokal
                    gelöscht werden.
                </p>
                <h2>3. Allgemeine Hinweise und Pflicht&shy;informationen</h2>
                <h3>Datenschutz</h3>{' '}
                <p>
                    Die Betreiber dieser Seiten nehmen den Schutz Ihrer pers&ouml;nlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten
                    vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerkl&auml;rung.
                </p>{' '}
                <p>
                    Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit denen
                    Sie pers&ouml;nlich identifiziert werden k&ouml;nnen. Die vorliegende Datenschutzerkl&auml;rung erl&auml;utert, welche Daten wir
                    erheben und wof&uuml;r wir sie nutzen. Sie erl&auml;utert auch, wie und zu welchem Zweck das geschieht.
                </p>{' '}
                <p>
                    Wir weisen darauf hin, dass die Daten&uuml;bertragung im Internet (z.&nbsp;B. bei der Kommunikation per E-Mail)
                    Sicherheitsl&uuml;cken aufweisen kann. Ein l&uuml;ckenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht m&ouml;glich.
                </p>
                <h3>Hinweis zur verantwortlichen Stelle</h3> <p>Die verantwortliche Stelle f&uuml;r die Datenverarbeitung auf dieser Website ist:</p>{' '}
                <p>
                    Mike Meyer
                    <br />
                    Claustorwall 9c
                    <br />
                    38640 Goslar
                </p>
                <p>
                    Telefon: +49 (0) 151 255 267 04
                    <br />
                    E-Mail: contact@mike-meyer.dev
                </p>
                <p>
                    Verantwortliche Stelle ist die nat&uuml;rliche oder juristische Person, die allein oder gemeinsam mit anderen &uuml;ber die Zwecke
                    und Mittel der Verarbeitung von personenbezogenen Daten (z.&nbsp;B. Namen, E-Mail-Adressen o. &Auml;.) entscheidet.
                </p>
                <h3>Speicherdauer</h3>{' '}
                <p>
                    Soweit innerhalb dieser Datenschutzerkl&auml;rung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen
                    Daten bei uns, bis der Zweck f&uuml;r die Datenverarbeitung entf&auml;llt. Wenn Sie ein berechtigtes L&ouml;schersuchen geltend
                    machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gel&ouml;scht, sofern wir keine anderen
                    rechtlich zul&auml;ssigen Gr&uuml;nde f&uuml;r die Speicherung Ihrer personenbezogenen Daten haben (z.&nbsp;B. steuer- oder
                    handelsrechtliche Aufbewahrungsfristen); im letztgenannten Fall erfolgt die L&ouml;schung nach Fortfall dieser Gr&uuml;nde.
                </p>
                <h3>Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung auf dieser Website</h3>{' '}
                <p>
                    Sofern Sie in die Datenverarbeitung eingewilligt haben, verarbeiten wir Ihre personenbezogenen Daten auf Grundlage von Art. 6 Abs.
                    1 lit. a DSGVO bzw. Art. 9 Abs. 2 lit. a DSGVO, sofern besondere Datenkategorien nach Art. 9 Abs. 1 DSGVO verarbeitet werden. Im
                    Falle einer ausdr&uuml;cklichen Einwilligung in die &Uuml;bertragung personenbezogener Daten in Drittstaaten erfolgt die
                    Datenverarbeitung au&szlig;erdem auf Grundlage von Art. 49 Abs. 1 lit. a DSGVO. Sofern Sie in die Speicherung von Cookies oder in
                    den Zugriff auf Informationen in Ihr Endger&auml;t (z.&nbsp;B. via Device-Fingerprinting) eingewilligt haben, erfolgt die
                    Datenverarbeitung zus&auml;tzlich auf Grundlage von &sect; 25 Abs. 1 TDDDG. Die Einwilligung ist jederzeit widerrufbar. Sind Ihre
                    Daten zur Vertragserf&uuml;llung oder zur Durchf&uuml;hrung vorvertraglicher Ma&szlig;nahmen erforderlich, verarbeiten wir Ihre
                    Daten auf Grundlage des Art. 6 Abs. 1 lit. b DSGVO. Des Weiteren verarbeiten wir Ihre Daten, sofern diese zur Erf&uuml;llung einer
                    rechtlichen Verpflichtung erforderlich sind auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO. Die Datenverarbeitung kann ferner auf
                    Grundlage unseres berechtigten Interesses nach Art. 6 Abs. 1 lit. f DSGVO erfolgen. &Uuml;ber die jeweils im Einzelfall
                    einschl&auml;gigen Rechtsgrundlagen wird in den folgenden Abs&auml;tzen dieser Datenschutzerkl&auml;rung informiert.
                </p>
                <h3>Empfänger von personenbezogenen Daten</h3>{' '}
                <p>
                    Im Rahmen unserer Gesch&auml;ftst&auml;tigkeit arbeiten wir mit verschiedenen externen Stellen zusammen. Dabei ist teilweise auch
                    eine &Uuml;bermittlung von personenbezogenen Daten an diese externen Stellen erforderlich. Wir geben personenbezogene Daten nur
                    dann an externe Stellen weiter, wenn dies im Rahmen einer Vertragserf&uuml;llung erforderlich ist, wenn wir gesetzlich hierzu
                    verpflichtet sind (z.&nbsp;B. Weitergabe von Daten an Steuerbeh&ouml;rden), wenn wir ein berechtigtes Interesse nach Art. 6 Abs. 1
                    lit. f DSGVO an der Weitergabe haben oder wenn eine sonstige Rechtsgrundlage die Datenweitergabe erlaubt. Beim Einsatz von
                    Auftragsverarbeitern geben wir personenbezogene Daten unserer Kunden nur auf Grundlage eines g&uuml;ltigen Vertrags &uuml;ber
                    Auftragsverarbeitung weiter. Im Falle einer gemeinsamen Verarbeitung wird ein Vertrag &uuml;ber gemeinsame Verarbeitung
                    geschlossen.
                </p>
                <h3>Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>{' '}
                <p>
                    Viele Datenverarbeitungsvorg&auml;nge sind nur mit Ihrer ausdr&uuml;cklichen Einwilligung m&ouml;glich. Sie k&ouml;nnen eine
                    bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtm&auml;&szlig;igkeit der bis zum Widerruf erfolgten Datenverarbeitung
                    bleibt vom Widerruf unber&uuml;hrt.
                </p>
                <h3>Widerspruchsrecht gegen die Datenerhebung in besonderen F&auml;llen sowie gegen Direktwerbung (Art. 21 DSGVO)</h3>{' '}
                <p>
                    WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT. E ODER F DSGVO ERFOLGT, HABEN SIE JEDERZEIT DAS RECHT, AUS
                    GR&Uuml;NDEN, DIE SICH AUS IHRER BESONDEREN SITUATION ERGEBEN, GEGEN DIE VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN WIDERSPRUCH
                    EINZULEGEN; DIES GILT AUCH F&Uuml;R EIN AUF DIESE BESTIMMUNGEN GEST&Uuml;TZTES PROFILING. DIE JEWEILIGE RECHTSGRUNDLAGE, AUF DENEN
                    EINE VERARBEITUNG BERUHT, ENTNEHMEN SIE DIESER DATENSCHUTZERKL&Auml;RUNG. WENN SIE WIDERSPRUCH EINLEGEN, WERDEN WIR IHRE
                    BETROFFENEN PERSONENBEZOGENEN DATEN NICHT MEHR VERARBEITEN, ES SEI DENN, WIR K&Ouml;NNEN ZWINGENDE SCHUTZW&Uuml;RDIGE GR&Uuml;NDE
                    F&Uuml;R DIE VERARBEITUNG NACHWEISEN, DIE IHRE INTERESSEN, RECHTE UND FREIHEITEN &Uuml;BERWIEGEN ODER DIE VERARBEITUNG DIENT DER
                    GELTENDMACHUNG, AUS&Uuml;BUNG ODER VERTEIDIGUNG VON RECHTSANSPR&Uuml;CHEN (WIDERSPRUCH NACH ART. 21 ABS. 1 DSGVO).
                </p>{' '}
                <p>
                    WERDEN IHRE PERSONENBEZOGENEN DATEN VERARBEITET, UM DIREKTWERBUNG ZU BETREIBEN, SO HABEN SIE DAS RECHT, JEDERZEIT WIDERSPRUCH
                    GEGEN DIE VERARBEITUNG SIE BETREFFENDER PERSONENBEZOGENER DATEN ZUM ZWECKE DERARTIGER WERBUNG EINZULEGEN; DIES GILT AUCH F&Uuml;R
                    DAS PROFILING, SOWEIT ES MIT SOLCHER DIREKTWERBUNG IN VERBINDUNG STEHT. WENN SIE WIDERSPRECHEN, WERDEN IHRE PERSONENBEZOGENEN
                    DATEN ANSCHLIESSEND NICHT MEHR ZUM ZWECKE DER DIREKTWERBUNG VERWENDET (WIDERSPRUCH NACH ART. 21 ABS. 2 DSGVO).
                </p>
                <h3>Beschwerde&shy;recht bei der zust&auml;ndigen Aufsichts&shy;beh&ouml;rde</h3>{' '}
                <p>
                    Im Falle von Verst&ouml;&szlig;en gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer Aufsichtsbeh&ouml;rde,
                    insbesondere in dem Mitgliedstaat ihres gew&ouml;hnlichen Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutma&szlig;lichen
                    Versto&szlig;es zu. Das Beschwerderecht besteht unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.
                </p>
                <h3>Recht auf Daten&shy;&uuml;bertrag&shy;barkeit</h3>{' '}
                <p>
                    Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erf&uuml;llung eines Vertrags automatisiert
                    verarbeiten, an sich oder an einen Dritten in einem g&auml;ngigen, maschinenlesbaren Format aush&auml;ndigen zu lassen. Sofern Sie
                    die direkte &Uuml;bertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch machbar
                    ist.
                </p>
                <h3>Auskunft, Berichtigung und L&ouml;schung</h3>{' '}
                <p>
                    Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft &uuml;ber Ihre
                    gespeicherten personenbezogenen Daten, deren Herkunft und Empf&auml;nger und den Zweck der Datenverarbeitung und ggf. ein Recht
                    auf Berichtigung oder L&ouml;schung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten k&ouml;nnen Sie
                    sich jederzeit an uns wenden.
                </p>
                <h3>Recht auf Einschr&auml;nkung der Verarbeitung</h3>{' '}
                <p>
                    Sie haben das Recht, die Einschr&auml;nkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Hierzu k&ouml;nnen Sie
                    sich jederzeit an uns wenden. Das Recht auf Einschr&auml;nkung der Verarbeitung besteht in folgenden F&auml;llen:
                </p>{' '}
                <ul>
                    {' '}
                    <li>
                        Wenn Sie die Richtigkeit Ihrer bei uns gespeicherten personenbezogenen Daten bestreiten, ben&ouml;tigen wir in der Regel Zeit,
                        um dies zu &uuml;berpr&uuml;fen. F&uuml;r die Dauer der Pr&uuml;fung haben Sie das Recht, die Einschr&auml;nkung der
                        Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
                    </li>{' '}
                    <li>
                        Wenn die Verarbeitung Ihrer personenbezogenen Daten unrechtm&auml;&szlig;ig geschah/geschieht, k&ouml;nnen Sie statt der
                        L&ouml;schung die Einschr&auml;nkung der Datenverarbeitung verlangen.
                    </li>{' '}
                    <li>
                        Wenn wir Ihre personenbezogenen Daten nicht mehr ben&ouml;tigen, Sie sie jedoch zur Aus&uuml;bung, Verteidigung oder
                        Geltendmachung von Rechtsanspr&uuml;chen ben&ouml;tigen, haben Sie das Recht, statt der L&ouml;schung die Einschr&auml;nkung
                        der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
                    </li>{' '}
                    <li>
                        Wenn Sie einen Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt haben, muss eine Abw&auml;gung zwischen Ihren und unseren
                        Interessen vorgenommen werden. Solange noch nicht feststeht, wessen Interessen &uuml;berwiegen, haben Sie das Recht, die
                        Einschr&auml;nkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
                    </li>{' '}
                </ul>{' '}
                <p>
                    Wenn Sie die Verarbeitung Ihrer personenbezogenen Daten eingeschr&auml;nkt haben, d&uuml;rfen diese Daten &ndash; von ihrer
                    Speicherung abgesehen &ndash; nur mit Ihrer Einwilligung oder zur Geltendmachung, Aus&uuml;bung oder Verteidigung von
                    Rechtsanspr&uuml;chen oder zum Schutz der Rechte einer anderen nat&uuml;rlichen oder juristischen Person oder aus Gr&uuml;nden
                    eines wichtigen &ouml;ffentlichen Interesses der Europ&auml;ischen Union oder eines Mitgliedstaats verarbeitet werden.
                </p>
                <h3>SSL- bzw. TLS-Verschl&uuml;sselung</h3>{' '}
                <p>
                    Diese Seite nutzt aus Sicherheitsgr&uuml;nden und zum Schutz der &Uuml;bertragung vertraulicher Inhalte, wie zum Beispiel
                    Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschl&uuml;sselung. Eine
                    verschl&uuml;sselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von &bdquo;http://&ldquo; auf
                    &bdquo;https://&ldquo; wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
                </p>{' '}
                <p>
                    Wenn die SSL- bzw. TLS-Verschl&uuml;sselung aktiviert ist, k&ouml;nnen die Daten, die Sie an uns &uuml;bermitteln, nicht von
                    Dritten mitgelesen werden.
                </p>
                <h2>4. Datenerfassung auf dieser Website</h2>
                <h3>Cookies</h3>{' '}
                <p>
                    Unsere Internetseiten verwenden so genannte &bdquo;Cookies&ldquo;. Cookies sind kleine Datenpakete und richten auf Ihrem
                    Endger&auml;t keinen Schaden an. Sie werden entweder vor&uuml;bergehend f&uuml;r die Dauer einer Sitzung (Session-Cookies) oder
                    dauerhaft (permanente Cookies) auf Ihrem Endger&auml;t gespeichert. Session-Cookies werden nach Ende Ihres Besuchs automatisch
                    gel&ouml;scht. Permanente Cookies bleiben auf Ihrem Endger&auml;t gespeichert, bis Sie diese selbst l&ouml;schen oder eine
                    automatische L&ouml;schung durch Ihren Webbrowser erfolgt.
                </p>{' '}
                <p>
                    Cookies k&ouml;nnen von uns (First-Party-Cookies) oder von Drittunternehmen stammen (sog. Third-Party-Cookies).
                    Third-Party-Cookies erm&ouml;glichen die Einbindung bestimmter Dienstleistungen von Drittunternehmen innerhalb von Webseiten
                    (z.&nbsp;B. Cookies zur Abwicklung von Zahlungsdienstleistungen).
                </p>{' '}
                <p>
                    Cookies haben verschiedene Funktionen. Zahlreiche Cookies sind technisch notwendig, da bestimmte Webseitenfunktionen ohne diese
                    nicht funktionieren w&uuml;rden (z.&nbsp;B. die Warenkorbfunktion oder die Anzeige von Videos). Andere Cookies k&ouml;nnen zur
                    Auswertung des Nutzerverhaltens oder zu Werbezwecken verwendet werden.
                </p>{' '}
                <p>
                    Cookies, die zur Durchf&uuml;hrung des elektronischen Kommunikationsvorgangs, zur Bereitstellung bestimmter, von Ihnen
                    erw&uuml;nschter Funktionen (z.&nbsp;B. f&uuml;r die Warenkorbfunktion) oder zur Optimierung der Website (z.&nbsp;B. Cookies zur
                    Messung des Webpublikums) erforderlich sind (notwendige Cookies), werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert,
                    sofern keine andere Rechtsgrundlage angegeben wird. Der Websitebetreiber hat ein berechtigtes Interesse an der Speicherung von
                    notwendigen Cookies zur technisch fehlerfreien und optimierten Bereitstellung seiner Dienste. Sofern eine Einwilligung zur
                    Speicherung von Cookies und vergleichbaren Wiedererkennungstechnologien abgefragt wurde, erfolgt die Verarbeitung
                    ausschlie&szlig;lich auf Grundlage dieser Einwilligung (Art. 6 Abs. 1 lit. a DSGVO und &sect; 25 Abs. 1 TDDDG); die Einwilligung
                    ist jederzeit widerrufbar.
                </p>{' '}
                <p>
                    Sie k&ouml;nnen Ihren Browser so einstellen, dass Sie &uuml;ber das Setzen von Cookies informiert werden und Cookies nur im
                    Einzelfall erlauben, die Annahme von Cookies f&uuml;r bestimmte F&auml;lle oder generell ausschlie&szlig;en sowie das automatische
                    L&ouml;schen der Cookies beim Schlie&szlig;en des Browsers aktivieren. Bei der Deaktivierung von Cookies kann die
                    Funktionalit&auml;t dieser Website eingeschr&auml;nkt sein.
                </p>{' '}
                <p>Welche Cookies und Dienste auf dieser Website eingesetzt werden, k&ouml;nnen Sie dieser Datenschutzerkl&auml;rung entnehmen.</p>
                <h3>Einwilligung mit Usercentrics</h3>{' '}
                <p>
                    Diese Website nutzt die Consent-Technologie von Usercentrics, um Ihre Einwilligung zur Speicherung bestimmter Cookies auf Ihrem
                    Endger&auml;t oder zum Einsatz bestimmter Technologien einzuholen und diese datenschutzkonform zu dokumentieren. Anbieter dieser
                    Technologie ist die Usercentrics GmbH, Sendlinger Stra&szlig;e 7, 80331 M&uuml;nchen, Website:{' '}
                    <a href="https://usercentrics.com/de/" target="_blank" rel="noopener noreferrer">
                        https://usercentrics.com/de/
                    </a>{' '}
                    (im Folgenden &bdquo;Usercentrics&ldquo;).
                </p>{' '}
                <p>Wenn Sie unsere Website betreten, werden folgende personenbezogene Daten an Usercentrics &uuml;bertragen:</p>{' '}
                <ul>
                    {' '}
                    <li>Ihre Einwilligung(en) bzw. der Widerruf Ihrer Einwilligung(en)</li> <li>Ihre IP-Adresse</li>{' '}
                    <li>Informationen &uuml;ber Ihren Browser</li> <li>Informationen &uuml;ber Ihr Endger&auml;t</li>{' '}
                    <li>Zeitpunkt Ihres Besuchs auf der Website</li> <li>Geolocation</li>{' '}
                </ul>{' '}
                <p>
                    Des Weiteren speichert Usercentrics ein Cookie in Ihrem Browser, um Ihnen die erteilten Einwilligungen bzw. deren Widerruf
                    zuordnen zu k&ouml;nnen. Die so erfassten Daten werden gespeichert, bis Sie uns zur L&ouml;schung auffordern, das
                    Usercentrics-Cookie selbst l&ouml;schen oder der Zweck f&uuml;r die Datenspeicherung entf&auml;llt. Zwingende gesetzliche
                    Aufbewahrungspflichten bleiben unber&uuml;hrt.
                </p>{' '}
                <p>
                    Das Usercentrics-Banner auf dieser Website wurde mit Hilfe von eRecht24 konfiguriert. Das erkennen Sie daran, dass im Banner das
                    Logo von eRecht24 auftaucht. Um das eRecht24-Logo im Banner auszuspielen, wird eine Verbindung zum Bildserver von eRecht24
                    hergestellt. Hierbei wird auch die IP-Adresse &uuml;bertragen, die jedoch nur in anonymisierter Form in den Server-Logs
                    gespeichert wird. Der Bildserver von eRecht24 befindet sich in Deutschland bei einem deutschen Anbieter. Das Banner selbst wird
                    ausschlie&szlig;lich von Usercentrics zur Verf&uuml;gung gestellt.
                </p>
                <p>
                    Der Einsatz von Usercentrics erfolgt, um die gesetzlich vorgeschriebenen Einwilligungen f&uuml;r den Einsatz bestimmter
                    Technologien einzuholen. Rechtsgrundlage hierf&uuml;r ist Art. 6 Abs. 1 lit. c DSGVO.
                </p>
                <h4>Auftragsverarbeitung</h4>{' '}
                <p>
                    Wir haben einen Vertrag &uuml;ber Auftragsverarbeitung (AVV) zur Nutzung des oben genannten Dienstes geschlossen. Hierbei handelt
                    es sich um einen datenschutzrechtlich vorgeschriebenen Vertrag, der gew&auml;hrleistet, dass dieser die personenbezogenen Daten
                    unserer Websitebesucher nur nach unseren Weisungen und unter Einhaltung der DSGVO verarbeitet.
                </p>
                <h3>Server-Log-Dateien</h3>{' '}
                <p>
                    Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser
                    automatisch an uns &uuml;bermittelt. Dies sind:
                </p>{' '}
                <ul>
                    {' '}
                    <li>Browsertyp und Browserversion</li> <li>verwendetes Betriebssystem</li> <li>Referrer URL</li>{' '}
                    <li>Hostname des zugreifenden Rechners</li> <li>Uhrzeit der Serveranfrage</li> <li>IP-Adresse</li>{' '}
                </ul>{' '}
                <p>Eine Zusammenf&uuml;hrung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.</p>{' '}
                <p>
                    Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes
                    Interesse an der technisch fehlerfreien Darstellung und der Optimierung seiner Website &ndash; hierzu m&uuml;ssen die
                    Server-Log-Files erfasst werden.
                </p>
                <h3>Anfrage per E-Mail oder Telefon</h3>{' '}
                <p>
                    Wenn Sie uns per E-Mail oder Telefon kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten
                    (Name, Anfrage) zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne
                    Ihre Einwilligung weiter.
                </p>{' '}
                <p>
                    Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erf&uuml;llung
                    eines Vertrags zusammenh&auml;ngt oder zur Durchf&uuml;hrung vorvertraglicher Ma&szlig;nahmen erforderlich ist. In allen
                    &uuml;brigen F&auml;llen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns
                    gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt
                    wurde; die Einwilligung ist jederzeit widerrufbar.
                </p>{' '}
                <p>
                    Die von Ihnen an uns per Kontaktanfragen &uuml;bersandten Daten verbleiben bei uns, bis Sie uns zur L&ouml;schung auffordern, Ihre
                    Einwilligung zur Speicherung widerrufen oder der Zweck f&uuml;r die Datenspeicherung entf&auml;llt (z.&nbsp;B. nach
                    abgeschlossener Bearbeitung Ihres Anliegens). Zwingende gesetzliche Bestimmungen &ndash; insbesondere gesetzliche
                    Aufbewahrungsfristen &ndash; bleiben unber&uuml;hrt.
                </p>
                <br />
                <br />
            </div>
        </div>
    );
}
