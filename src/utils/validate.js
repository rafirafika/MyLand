const validate = {
    checkEmpty,
    setErrEmpty,
}
function checkEmpty(form, errs) {
    let count = 0;
    Object.keys(errs).map(err => {
        if (!Array.isArray(form[err])) {
            if (typeof form[err] !== 'object') {
                if (form[err] == undefined || form[err] == null || form[err] == '') {
                    count += 1;
                }
            }
        }
    });
    return count ? true : false;
}

function setErrEmpty(form, errs) {
    Object.keys(errs).map(err => {
        if (!Array.isArray(form[err])) {
            if (typeof form[err] !== 'object') {
                if (form[err] == undefined || form[err] == null || form[err] == '') {
                    errs[err] = true;
                }
            }
        }
    });
    return errs;
}

export default validate;

