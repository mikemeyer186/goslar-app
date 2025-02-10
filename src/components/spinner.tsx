import { useSearchParams } from 'react-router-dom';

interface SpinnerProps {
    isAllConsentsAccepted: boolean;
}

export default function Spinner({ isAllConsentsAccepted }: SpinnerProps) {
    const [searchParams] = useSearchParams('');
    const spinnerMessage =
        isAllConsentsAccepted || searchParams.get('externalconsent')
            ? ''
            : 'Um die Website nutzen zu können, musst du die funktionellen Cookies akzeptieren';

    return (
        <div className="spinner">
            <span className="loader"></span>
            <span className="spinner-text">{spinnerMessage}</span>
        </div>
    );
}
