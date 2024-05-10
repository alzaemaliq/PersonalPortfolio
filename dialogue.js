document.addEventListener('DOMContentLoaded', function() {
    const dialogueTexts = [
        "Ah, a new visitor! Welcome to my realm, a space where creativity and coding intertwine like the roots of the ancient Scriptwood Tree. I am glad to have you embark on this adventure through my digital landscape.",
        "If you venture north, you will find the Stone Columns of Legacy. Each column is carefully inscribed with tales of my previous projects, standing as testaments to the journeys I've undertaken and the solutions I've crafted.",
        "To the west lies an old statue, a silent keeper of my story. Converse with it, and it will share the tale of my path, the challenges faced, and the skills honed along the way. A narrative etched in time and memory.",
        "And down south, beyond the ancient gates, you'll find a portal that leads to an ancient battleground—my upcoming projects. It's still under production, but soon, it will be a place where new challenges are met, and further skills are tested.",
        "Should you wish to contact me or follow my journey on social media, venture east where you’ll encounter the Wayfarer of the East, ready to link you to my digital presences. Enjoy your exploration, and safe travels—may creativity be your ever-burning torch!"
    ];
    let currentText = 0;
    const dialogueBox = document.getElementById('dialogueBox');
    const dialogueTextElement = document.getElementById('dialogueText');

    function showDialogue() {
        dialogueBox.style.display = 'block';
        dialogueTextElement.textContent = dialogueTexts[currentText];
    }

    function hideDialogue() {
        dialogueBox.style.display = 'none';
    }

    showDialogue();

    document.addEventListener('keydown', function(event) {
        if (event.key === ' ' && dialogueBox.style.display !== 'none') {
            event.preventDefault();
            if (currentText < dialogueTexts.length - 1) {
                currentText++;
                showDialogue();
            } else {
                hideDialogue();
            }
        }
    });
});
