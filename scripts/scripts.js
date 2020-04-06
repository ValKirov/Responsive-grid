// Since I'm lazy I'm adding the New labels dynamically
$(document).ready(function () {

    var newLabel = "<span class=\"game-label new\"><img src=\"assets/images/labels/new.png\" alt=\"New label\"></span>";

    $('.box').each(function () {
        var $this = $(this);
        var thisTags = $this.data('tags').split(',');
        var cleanTagsArray = [];

        for (var i = 0; i < thisTags.length; i++) {
            var tagName = thisTags[i].trim();

            cleanTagsArray.push(tagName);
        }

        if (!(jQuery.inArray("new", cleanTagsArray) === -1)) {
            $this.find('a').append(newLabel);
        }
    });
});

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};


var filtering = debounce(function () {

    var $this = $(this);
    // Retrieve the input field text
    var filter = $this.val().toLowerCase();
    var isShowingResults = $('.container').hasClass('filtered-games') && !$('.filter.active').is('[data-filter="all"]');



    // Loop through the game list
    $(".box").each(function () {
        var $this = $(this);
        var gameName = $this.data('game');

        // If the list item does not contain the text phrase fade it out
        if (gameName.toLowerCase().search(new RegExp(filter, "i")) < 0) {
            $this.addClass('hidden-item');

            // Show the list item if the phrase matches and increase the count by 1
        } else {
            $this.removeClass('hidden-item');
        }
    });

    noResults();

    if ($this.val().length && !isShowingResults) {
        $('.container').addClass('filtered-games');
    }
    // else if ($this.val().length && isShowingResults) {
    //     return;
    // }
    else if (!$this.val().length && !isShowingResults) {
        $('.container').removeClass('filtered-games');
    }
}, 500);

// Made the search work when typing instead of when licking the submit button
$("#game-filter").on('keyup', filtering);


function noResults() {
    if ($('.box:visible').length == 0) {
        $('.no-results').show();
    }
    else {
        $('.no-results').hide();
    }
};


$('.filter').on('click', function () {
    var $this = $(this);
    var toFilter = $this.data('filter');

    $this.addClass('active').siblings().removeClass('active');

    if (toFilter === 'all') {

        $('.box').removeAttr('style');
        
        if (!$('#game-filter').val().length) {
            $('.container').removeClass('filtered-games');
            $('.box').show();        }

        return;
    }

    if (!$('.container').hasClass('filtered-games')) {
        $('.container').addClass('filtered-games');
    }    

    $('.box').each(function () {
        var $this = $(this);

        if (!$this.hasClass('hidden-item')) {

            var thisTags = $this.data('tags').split(',');
            var cleanTagsArray = [];
            
            for (var i = 0; i < thisTags.length; i++) {
                var tagName = thisTags[i].trim();
                
                cleanTagsArray.push(tagName);
            }
            
            if (jQuery.inArray(toFilter, cleanTagsArray) === -1) {
                $this.hide();
            }
            else {
                $this.show();
            }
        }
    });
});