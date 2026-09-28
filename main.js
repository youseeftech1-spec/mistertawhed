import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ==================================================
// MOBILE MENU
// ==================================================

const menuButton = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");

if (menuButton && nav) {

    menuButton.addEventListener("click", function () {

        nav.classList.toggle("active");

    });

}


// ==================================================
// GET PACKAGE ID
// ==================================================

const urlParams = new URLSearchParams(window.location.search);
const packageId = urlParams.get("id");


// ==================================================
// PRODUCT PAGE
// ==================================================

async function loadProductFromFirebase() {

    const productName = document.querySelector("#productName");

    if (!productName || !packageId) {
        return;
    }

    try {

        const packageRef = doc(
            db,
            "packages",
            packageId
        );

        const packageSnap = await getDoc(packageRef);

        if (!packageSnap.exists()) {

            console.log("الباكدج غير موجودة في Firebase");
            return;

        }

        const selectedPackage = packageSnap.data();


        // ==================================================
        // NAME
        // ==================================================

        const productNameElement =
            document.querySelector("#productName");

        if (productNameElement) {

            productNameElement.textContent =
                selectedPackage.name || "";

        }


        // ==================================================
        // PRICE
        // ==================================================

        const productPrice =
            document.querySelector("#productPrice");

        if (productPrice) {

            productPrice.textContent =
                (selectedPackage.price || "") + " جنيه";

        }


        // ==================================================
        // DESCRIPTION
        // ==================================================

        const productDescription =
            document.querySelector("#productDescription");

        if (productDescription) {

            productDescription.textContent =
                selectedPackage.description || "";

        }

        // ==================================================
        // MAIN IMAGE + GALLERY
        // ==================================================

        const productImage =
            document.querySelector("#productImage");

        const productGallery =
            document.querySelector("#productGallery");


        let mainImage =
            selectedPackage.image ||
            "assets/images/package-1.jpg";


        let galleryImages =
            Array.isArray(selectedPackage.gallery)
                ? selectedPackage.gallery.filter(
                    function (image) {
                        return image && image.trim() !== "";
                    }
                )
                : [];


        // ==================================================
        // MAIN IMAGE
        // ==================================================

        if (productImage) {

            productImage.src = mainImage;

            productImage.alt =
                selectedPackage.name || "";

        }


        // ==================================================
        // GALLERY
        // ==================================================

        if (productGallery) {

            productGallery.innerHTML = "";


            galleryImages.forEach(
                function (imageUrl) {

                    const thumbnail =
                        document.createElement("img");


                    thumbnail.src =
                        imageUrl;

                    thumbnail.alt =
                        selectedPackage.name || "";

                    thumbnail.className =
                        "product-gallery-image";


                    // عند الضغط على الصورة الصغيرة
                    thumbnail.addEventListener(
                        "click",
                        function () {

                            if (productImage) {

                                productImage.src =
                                    imageUrl;

                            }

                        }
                    );


                    productGallery.appendChild(
                        thumbnail
                    );

                }
            );

        }

        // ==================================================
        // PRODUCTS INSIDE PACKAGE
        // ==================================================

        const productsList =
            document.querySelector(
                "#packageProductsList"
            );


        if (productsList) {

            productsList.innerHTML = "";


            const products =
                Array.isArray(selectedPackage.products)
                    ? selectedPackage.products
                    : [];


            products.forEach(
                function (product) {

                    if (!product) {
                        return;
                    }


                    const item =
                        document.createElement("div");


                    item.className =
                        "package-product-item";


                    item.textContent =
                        product;


                    productsList.appendChild(
                        item
                    );

                }
            );

        }


        // ==================================================
        // PACKAGE DETAILS
        // ==================================================

        const featuresList =
            document.querySelector(
                "#productFeatures"
            );


        if (featuresList) {

            featuresList.innerHTML = "";


            const details =
                selectedPackage.details || "";


            if (details) {

                const detailsLines =
                    details
                        .split("\n")
                        .map(
                            function (line) {
                                return line.trim();
                            }
                        )
                        .filter(
                            function (line) {
                                return line !== "";
                            }
                        );


                detailsLines.forEach(
                    function (detail) {

                        const li =
                            document.createElement("li");


                        li.textContent =
                            detail.startsWith("•")
                                ? "✓ " + detail.substring(1).trim()
                                : "✓ " + detail;


                        featuresList.appendChild(
                            li
                        );

                    }
                );

            }

        }


        // ==================================================
        // ORDER BUTTON
        // ==================================================

        const orderButton =
            document.querySelector(
                "#orderButton"
            );


        if (orderButton) {

            orderButton.href =
                "order.html?id=" +
                packageId;

        }

    } catch (error) {

        console.error(
            "Error loading product:",
            error
        );

    }

}


loadProductFromFirebase();


// ==================================================
// ORDER PAGE
// ==================================================

const orderForm =
    document.querySelector("#orderForm");


if (orderForm) {


    let orderPackage = null;


    // ==================================================
    // LOAD ORDER PACKAGE
    // ==================================================

    async function loadOrderPackage() {

        if (!packageId) {

            console.log(
                "لا يوجد Package ID في الرابط."
            );

            return;

        }


        try {

            const packageRef =
                doc(
                    db,
                    "packages",
                    packageId
                );


            const packageSnap =
                await getDoc(
                    packageRef
                );


            if (!packageSnap.exists()) {

                console.log(
                    "الباكدج المطلوبة غير موجودة."
                );

                return;

            }


            orderPackage =
                packageSnap.data();


            // ==================================================
            // IMAGE
            // ==================================================

            const summaryImage =
                document.querySelector(
                    "#summaryImage"
                );


            if (summaryImage) {

                summaryImage.src =
                    orderPackage.image ||
                    "assets/images/package-1.jpg";

                summaryImage.alt =
                    orderPackage.name || "";

            }


            // ==================================================
            // NAME
            // ==================================================

            const summaryName =
                document.querySelector(
                    "#summaryName"
                );


            if (summaryName) {

                summaryName.textContent =
                    orderPackage.name || "";

            }


            // ==================================================
            // DESCRIPTION
            // ==================================================

            const summaryDescription =
                document.querySelector(
                    "#summaryDescription"
                );


            if (summaryDescription) {

                summaryDescription.textContent =
                    orderPackage.description || "";

            }


            // ==================================================
            // PRICE
            // ==================================================

            const summaryPrice =
                document.querySelector(
                    "#summaryPrice"
                );


            if (summaryPrice) {

                summaryPrice.textContent =
                    (orderPackage.price || "") +
                    " جنيه";

            }

        } catch (error) {

            console.error(
                "Error loading order package:",
                error
            );

        }

    }


    loadOrderPackage();


    // ==================================================
    // SEND ORDER TO WHATSAPP
    // ==================================================

    orderForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ==================================================
            // CUSTOMER DATA
            // ==================================================

            const name =
                document.querySelector(
                    "#name"
                ).value.trim();


            const phone =
                document.querySelector(
                    "#phone"
                ).value.trim();


            const governorate =
                document.querySelector(
                    "#governorate"
                ).value;


            const address =
                document.querySelector(
                    "#address"
                ).value.trim();


            const notes =
                document.querySelector(
                    "#notes"
                ).value.trim();


            // ==================================================
            // VALIDATION
            // ==================================================

            if (
                !name ||
                !phone ||
                !governorate ||
                !address
            ) {

                alert(
                    "من فضلك أكمل البيانات المطلوبة."
                );

                return;

            }


            // ==================================================
            // CHECK PACKAGE
            // ==================================================

            if (!orderPackage) {

                alert(
                    "لم نتمكن من تحميل بيانات الباكدج. حاول مرة أخرى."
                );

                return;

            }


            // ==================================================
            // PACKAGE DATA
            // ==================================================

            const packageName =
                orderPackage.name || "";


            const packagePrice =
                orderPackage.price || "";


            // ==================================================
            // WHATSAPP MESSAGE
            // ==================================================

            const message =
                `طلب جديد من موقع مستر توحيد

الباكدج: ${packageName}
السعر: ${packagePrice} جنيه

اسم العميل: ${name}
رقم الهاتف: ${phone}
المحافظة: ${governorate}
العنوان: ${address}
ملاحظات: ${notes || "لا توجد"}`;


            // ==================================================
            // WHATSAPP NUMBER
            // ==================================================

            const whatsappNumber =
                "201515641899";


            const whatsappURL =
                "https://wa.me/" +
                whatsappNumber +
                "?text=" +
                encodeURIComponent(message);


            // ==================================================
            // OPEN WHATSAPP
            // ==================================================

            window.open(
                whatsappURL,
                "_blank"
            );

        }
    );

}


// ==================================================
// DASHBOARD
// ==================================================

const addPackageBtn =
    document.querySelector(
        "#addPackageBtn"
    );


const packageModal =
    document.querySelector(
        "#packageModal"
    );


const closePackageModal =
    document.querySelector(
        "#closePackageModal"
    );


const packageForm =
    document.querySelector(
        "#packageForm"
    );


const dashboardPackages =
    document.querySelector(
        "#dashboardPackages"
    );


const modalTitle =
    document.querySelector(
        "#modalTitle"
    );


const savePackageBtn =
    document.querySelector(
        "#savePackageBtn"
    );


let editingPackageId = null;


// ==================================================
// OPEN ADD PACKAGE
// ==================================================

if (
    addPackageBtn &&
    packageModal
) {

    addPackageBtn.addEventListener(
        "click",
        function () {

            editingPackageId = null;


            if (modalTitle) {

                modalTitle.textContent =
                    "إضافة باكدج";

            }


            if (savePackageBtn) {

                savePackageBtn.textContent =
                    "حفظ الباكدج";

            }


            if (packageForm) {

                packageForm.reset();

            }


            packageModal.classList.add(
                "active"
            );

        }
    );

}


// ==================================================
// CLOSE MODAL
// ==================================================

if (
    closePackageModal &&
    packageModal
) {

    closePackageModal.addEventListener(
        "click",
        function () {

            packageModal.classList.remove(
                "active"
            );

        }
    );

}


// ==================================================
// LOAD DASHBOARD PACKAGES
// ==================================================

async function loadDashboardPackages() {

    if (!dashboardPackages) {
        return;
    }


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "packages"
                )
            );


        dashboardPackages.innerHTML = "";


        if (snapshot.empty) {

            dashboardPackages.innerHTML = `
                <p>
                    لا توجد باكدجات حاليًا.
                </p>
            `;

            return;

        }


        snapshot.forEach(
            function (packageDocument) {

                const packageData =
                    packageDocument.data();


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "dashboard-package-card";


                const info =
                    document.createElement(
                        "div"
                    );


                info.className =
                    "dashboard-package-info";


                const title =
                    document.createElement(
                        "h3"
                    );


                title.textContent =
                    packageData.name || "";


                const description =
                    document.createElement(
                        "p"
                    );


                description.textContent =
                    packageData.description || "";


                const price =
                    document.createElement(
                        "strong"
                    );


                price.textContent =
                    (packageData.price || "") +
                    " جنيه";


                info.appendChild(title);
                info.appendChild(description);
                info.appendChild(price);


                const actions =
                    document.createElement(
                        "div"
                    );


                actions.className =
                    "dashboard-package-actions";


                const editButton =
                    document.createElement(
                        "button"
                    );


                editButton.type =
                    "button";


                editButton.className =
                    "btn edit-package-btn";


                editButton.textContent =
                    "تعديل";


                editButton.dataset.id =
                    packageDocument.id;


                const deleteButton =
                    document.createElement(
                        "button"
                    );


                deleteButton.type =
                    "button";


                deleteButton.className =
                    "delete-package-btn";


                deleteButton.textContent =
                    "حذف";


                deleteButton.dataset.id =
                    packageDocument.id;


                actions.appendChild(
                    editButton
                );


                actions.appendChild(
                    deleteButton
                );


                card.appendChild(info);
                card.appendChild(actions);


                dashboardPackages.appendChild(
                    card
                );


                // ==================================================
                // EDIT
                // ==================================================

                editButton.addEventListener(
                    "click",
                    function () {

                        editPackage(
                            packageDocument.id
                        );

                    }
                );


                // ==================================================
                // DELETE
                // ==================================================

                deleteButton.addEventListener(
                    "click",
                    function () {

                        deletePackage(
                            packageDocument.id
                        );

                    }
                );

            }
        );

    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );


        dashboardPackages.innerHTML = `
            <p>
                حصل خطأ أثناء تحميل الباكدجات.
            </p>
        `;

    }

}


// ==================================================
// EDIT PACKAGE
// ==================================================

async function editPackage(id) {

    if (!packageModal) {
        return;
    }


    try {

        const packageRef =
            doc(
                db,
                "packages",
                id
            );


        const packageSnap =
            await getDoc(
                packageRef
            );


        if (!packageSnap.exists()) {

            alert(
                "الباكدج غير موجودة."
            );

            return;

        }


        const packageData =
            packageSnap.data();


        editingPackageId =
            id;


        // ==================================================
        // NAME
        // ==================================================

        const packageName =
            document.querySelector(
                "#packageName"
            );


        if (packageName) {

            packageName.value =
                packageData.name || "";

        }


        // ==================================================
        // PRICE
        // ==================================================

        const packagePrice =
            document.querySelector(
                "#packagePrice"
            );


        if (packagePrice) {

            packagePrice.value =
                packageData.price || "";

        }


        // ==================================================
        // IMAGE
        // ==================================================

        const packageImage =
            document.querySelector(
                "#packageImage"
            );


        if (packageImage) {

            packageImage.value =
                packageData.image || "";

        }


        // ==================================================
        // GALLERY
        // ==================================================

        const packageGallery =
            document.querySelector(
                "#packageGallery"
            );


        if (packageGallery) {

            packageGallery.value =
                Array.isArray(
                    packageData.gallery
                )
                    ? packageData.gallery.join("\n")
                    : "";

        }


        // ==================================================
        // DESCRIPTION
        // ==================================================

        const packageDescription =
            document.querySelector(
                "#packageDescription"
            );


        if (packageDescription) {

            packageDescription.value =
                packageData.description || "";

        }


        // ==================================================
        // DETAILS
        // ==================================================

        const packageDetails =
            document.querySelector(
                "#packageDetails"
            );


        if (packageDetails) {

            packageDetails.value =
                packageData.details || "";

        }


        // ==================================================
        // PRODUCTS
        // ==================================================

        const packageProducts =
            document.querySelector(
                "#packageProducts"
            );


        if (packageProducts) {

            packageProducts.value =
                Array.isArray(
                    packageData.products
                )
                    ? packageData.products.join("\n")
                    : "";

        }


        // ==================================================
        // MODAL
        // ==================================================

        if (modalTitle) {

            modalTitle.textContent =
                "تعديل الباكدج";

        }


        if (savePackageBtn) {

            savePackageBtn.textContent =
                "حفظ التعديل";

        }


        packageModal.classList.add(
            "active"
        );

    } catch (error) {

        console.error(
            "Edit Error:",
            error
        );


        alert(
            "حصل خطأ أثناء تحميل الباكدج."
        );

    }

}


// ==================================================
// DELETE PACKAGE
// ==================================================

async function deletePackage(id) {

    const confirmDelete =
        confirm(
            "هل أنت متأكد من حذف هذه الباكدج؟"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                "packages",
                id
            )
        );


        alert(
            "تم حذف الباكدج بنجاح ✅"
        );


        await loadDashboardPackages();

        await loadStorePackages();

    } catch (error) {

        console.error(
            "Delete Error:",
            error
        );


        alert(
            "حصل خطأ أثناء حذف الباكدج."
        );

    }

}


// ==================================================
// ADD / UPDATE PACKAGE
// ==================================================

if (packageForm) {

    packageForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ==================================================
            // BASIC DATA
            // ==================================================

            const name =
                document.querySelector(
                    "#packageName"
                ).value.trim();


            const price =
                document.querySelector(
                    "#packagePrice"
                ).value.trim();


            const description =
                document.querySelector(
                    "#packageDescription"
                ).value.trim();


            const details =
                document.querySelector(
                    "#packageDetails"
                ).value.trim();


            // ==================================================
            // IMAGE
            // ==================================================

            const image =
                document.querySelector(
                    "#packageImage"
                ).value.trim();


            // ==================================================
            // GALLERY
            // ==================================================

            const galleryText =
                document.querySelector(
                    "#packageGallery"
                ).value.trim();


            const gallery =
                galleryText
                    ? galleryText
                        .split("\n")
                        .map(
                            function (url) {
                                return url.trim();
                            }
                        )
                        .filter(
                            function (url) {
                                return url !== "";
                            }
                        )
                    : [];


            // ==================================================
            // PRODUCTS
            // ==================================================

            const productsText =
                document.querySelector(
                    "#packageProducts"
                ).value.trim();


            const products =
                productsText
                    ? productsText
                        .split("\n")
                        .map(
                            function (product) {
                                return product.trim();
                            }
                        )
                        .filter(
                            function (product) {
                                return product !== "";
                            }
                        )
                    : [];


            // ==================================================
            // VALIDATION
            // ==================================================

            if (!name || !price) {

                alert(
                    "من فضلك أدخل اسم الباكدج والسعر."
                );

                return;

            }


            try {

                // ==================================================
                // UPDATE
                // ==================================================

                if (editingPackageId) {

                    await updateDoc(
                        doc(
                            db,
                            "packages",
                            editingPackageId
                        ),
                        {
                            name: name,
                            price: price,
                            description: description,
                            details: details,
                            image: image,
                            gallery: gallery,
                            products: products
                        }
                    );


                    alert(
                        "تم تعديل الباكدج بنجاح ✅"
                    );

                }


                // ==================================================
                // ADD
                // ==================================================

                else {

                    await addDoc(
                        collection(
                            db,
                            "packages"
                        ),
                        {
                            name: name,
                            price: price,
                            description: description,
                            details: details,
                            image: image,
                            gallery: gallery,
                            products: products,
                            createdAt: serverTimestamp()
                        }
                    );


                    alert(
                        "تم إضافة الباكدج بنجاح ✅"
                    );

                }


                // ==================================================
                // RESET
                // ==================================================

                editingPackageId = null;


                packageForm.reset();


                packageModal.classList.remove(
                    "active"
                );


                await loadDashboardPackages();

                await loadStorePackages();

            } catch (error) {

                console.error(
                    "Firebase Error:",
                    error
                );


                alert(
                    "حصل خطأ أثناء حفظ الباكدج. افتح Console لمعرفة السبب."
                );

            }

        }
    );

}


// ==================================================
// LOAD PACKAGES IN STORE
// ==================================================

const packagesGrid =
    document.querySelector(
        ".packages-grid"
    );


async function loadStorePackages() {

    if (!packagesGrid) {
        return;
    }


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "packages"
                )
            );


        packagesGrid.innerHTML = "";


        if (snapshot.empty) {

            packagesGrid.innerHTML = `
                <p>
                    لا توجد باكدجات حاليًا.
                </p>
            `;

            return;

        }


        snapshot.forEach(
            function (packageDocument) {

                const packageData =
                    packageDocument.data();


                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "package-card";


                // ==================================================
                // IMAGE
                // ==================================================

                const imageBox =
                    document.createElement(
                        "div"
                    );


                imageBox.className =
                    "package-image";


                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    packageData.image ||
                    "assets/images/package-1.jpg";


                image.alt =
                    packageData.name || "";


                imageBox.appendChild(
                    image
                );


                // ==================================================
                // CONTENT
                // ==================================================

                const content =
                    document.createElement(
                        "div"
                    );


                content.className =
                    "package-content";


                const title =
                    document.createElement(
                        "h3"
                    );


                title.textContent =
                    packageData.name || "";


                const description =
                    document.createElement(
                        "p"
                    );


                description.textContent =
                    packageData.description || "";


                // ==================================================
                // BOTTOM
                // ==================================================

                const bottom =
                    document.createElement(
                        "div"
                    );


                bottom.className =
                    "package-bottom";


                const price =
                    document.createElement(
                        "strong"
                    );


                price.textContent =
                    (packageData.price || "") +
                    " جنيه";


                const detailsButton =
                    document.createElement(
                        "a"
                    );


                detailsButton.href =
                    "product.html?id=" +
                    packageDocument.id;


                detailsButton.className =
                    "btn";


                detailsButton.textContent =
                    "عرض التفاصيل";


                bottom.appendChild(
                    price
                );


                bottom.appendChild(
                    detailsButton
                );


                content.appendChild(
                    title
                );


                content.appendChild(
                    description
                );


                content.appendChild(
                    bottom
                );


                card.appendChild(
                    imageBox
                );


                card.appendChild(
                    content
                );


                packagesGrid.appendChild(
                    card
                );

            }
        );

    } catch (error) {

        console.error(
            "Store Error:",
            error
        );


        packagesGrid.innerHTML = `
            <p>
                حصل خطأ أثناء تحميل الباكدجات.
            </p>
        `;

    }

}


// ==================================================
// START
// ==================================================

loadStorePackages();

loadDashboardPackages();