const search = function() {
    const input = document.querySelector('.search-block > input');
    const searchBtn = document.querySelector('.seatch-block > button');

    input.addEventListener('click', (searchBtn) => {
        console.log(input.value);
    });
};

search();