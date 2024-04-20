class WebRTCSession {
    private offer: string | null = null;
    private answer: string | null = null;
    private iceCandidates: string[] = [];

    setOffer(offer: string): void {
        this.offer = offer;
    }

    setAnswer(answer: string): void {
        this.answer = answer;
    }

    addICECandidate(candidate: string): void {
        this.iceCandidates.push(candidate);
    }

    getOffer(): string | null {
        return this.offer;
    }

    getAnswer(): string | null {
        return this.answer;
    }

    getICECandidates(): string[] {
        return this.iceCandidates;
    }
}

export { WebRTCSession };