const keyString = "players";

$(document).ready(() => {
    if (!getPlayerList()) {
        renderInitialAddPlayerInputs();
        $("#modal").show();
        $("#leaderboard").hide();
        $("#controls").hide();
    } else {
        $("#modal").hide();
        $("#leaderboard").show();
        $("#controls").show();
    }

    renderPlayers();
});

function closeModal() {
    $("#modal").hide();
}

function clearModalBody() {
    $("#modal .modal-body").empty();
    $("#modal #modal-submit").off();
}

function renderInitialAddPlayerInputs() {
    const modalBody = $("#modal .modal-body");
    const submitButton = $("#modal #modal-submit");
    for (let i = 1; i < 5; i++) {
        const element = `<input class="add-player-inputs form-control" type="text" placeholder="Tên${i}" />`;
        modalBody.append(element);
    }

    submitButton.on("click", () => {
        addPlayers();
        closeModal();
    });
}

function addPlayers() {
    const players = $(".add-player-inputs");
    const playerList = [];

    for (const player of players.filter((_, p) => $(p).val())) {
        playerList.push({
            key: $(player).val(),
            value: 0,
        });
    }

    localStorage.setItem(keyString, JSON.stringify(playerList));
}

function getPlayerList() {
    const playerList = localStorage.getItem(keyString);
    if (!playerList) return null;

    const parsedPlayerList = JSON.parse(playerList);

    return parsedPlayerList;
}

function setPlayerList(playerList) {
    localStorage.setItem(keyString, JSON.stringify(playerList));
}

function renderPlayers() {
    const playerList = getPlayerList();
    const sortedList = playerList.sort(
        (a, b) => parseInt(b.value) - parseInt(a.value)
    );
    const leaderboardBody = $("#leaderboard > tbody");
    let rank = 1;

    for (const player of sortedList) {
        const value = `<tr>
            <th scope="row">${rank}</th>
            <td>${player.key}</td>
            <td>${player.value}</td>
        </tr>`;
        leaderboardBody.append(value);
        rank++;
    }
}

function renderModalForCalculating() {
    clearModalBody();
    const modal = $("#modal");
    const modalBody = $("#modal .modal-body");
    const submitButton = $("#modal #modal-submit");
    const playerList = getPlayerList();

    playerList.forEach((player, index) => {
        const element = `<label for="tinh-tien-player-${player.index}" class="form-label">${player.key}</label>
        <input key="${index}" id="tinh-tien-player-${player.index}" class="add-player-total form-control" type="number" />`;

        modalBody.append(element);
    });

    modalBody.append(`<div class="invalid-feedback">
    Tổng có = 0 đâu
  </div>`);

    modal.show();
    submitButton.on("click", (e) => {
        const inputs = $("#modal .modal-body .add-player-total");
        const mappedValues = Array.from(
            inputs.map((_, input) => parseInt($(input).val() || 0))
        );

        const sum = mappedValues.reduce(
            (partialSum, value) => partialSum + value
        );

        if (sum != 0) {
            e.preventDefault();
            e.stopPropagation();
            $(".invalid-feedback").show();
            return;
        } else {
            $(".invalid-feedback").hide();
        }

        for (const input of inputs) {
            const key = $(input).attr("key");
            const value = parseInt($(input).val());

            if (value) {
                const intValue = parseInt(playerList[key].value);
                playerList[key].value = intValue + value;
            }
        }

        setPlayerList(playerList);
        closeModal();
    });
}

function clearGame() {
    const isConfirmed = confirm("Reset game nha?");

    if (isConfirmed) {
        clearModalBody();
        localStorage.removeItem(keyString);
        location.reload();
    }
}
