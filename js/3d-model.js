// تهيئة المشهد الثلاثي الأبعاد
let scene, camera, renderer;
let cube, cubeGroup;
let particles = [];
let isHovered = false;
let targetRotation = { x: 0, y: 0 };
let currentRotation = { x: 0, y: 0 };
let mouseVelocity = { x: 0, y: 0 };
let lastMousePosition = { x: 0, y: 0 };
let phonePopup = null;

function init() {
    // إنشاء المشهد
    scene = new THREE.Scene();
    
    // إنشاء الكاميرا
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // إنشاء المحرك
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('hero-canvas'),
        alpha: true,
        antialias: true
    });
    
    // تعديل حجم المحرك
    const container = document.querySelector('.hero-3d-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    
    // إنشاء المكعب
    createCube();
    
    // إضافة الإضاءة
    addLights();
    
    // إضافة الجزيئات
    createParticles();
    
    // إضافة التفاعل مع الماوس
    addMouseInteraction();
    
    // بدء التحرك
    animate();
    
    // إضافة مستمع لتغيير حجم النافذة
    window.addEventListener('resize', onWindowResize, false);
}

function createCube() {
    // إنشاء مجموعة للمكعب
    cubeGroup = new THREE.Group();
    
    // إنشاء المكعب
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const materials = Array(6).fill().map(() => 
        new THREE.MeshPhongMaterial({
            color: 0x12F906,
            transparent: false,
            opacity: 1,
            shininess: 100,
            specular: 0xffffff,
            emissive: 0x12F906,
            emissiveIntensity: 0.2
        })
    );
    
    cube = new THREE.Mesh(geometry, materials);
    cube.scale.set(0.18, 0.18, 0.18);
    cubeGroup.add(cube);
    
    scene.add(cubeGroup);
    
    // تفاعل النقر على المكعب
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    function onClick(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects([cube]);
        if (intersects.length > 0) {
            showPhonePopup(event.clientX, event.clientY);
        } else {
            hidePhonePopup();
        }
    }
    renderer.domElement.addEventListener('click', onClick);
}

function createParticles() {
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        particlePositions[i] = (Math.random() - 0.5) * 10;
        particlePositions[i + 1] = (Math.random() - 0.5) * 10;
        particlePositions[i + 2] = (Math.random() - 0.5) * 10;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x12F906,
        size: 0.1,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    particles.push(particleSystem);
}

function addLights() {
    // إضاءة محيطة
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // إضاءة موجهة
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // إضاءة نقطية
    const pointLight = new THREE.PointLight(0x12F906, 1, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);
}

function addMouseInteraction() {
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        let relX = Math.max(0, event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        relX = Math.min(relX, 1);
        mouseX = relX;
        mouseY = event.clientY / window.innerHeight;
    });
    document.addEventListener('touchmove', (event) => {
        let touch = event.touches[0];
        let relX = Math.max(0, touch.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        relX = Math.min(relX, 1);
        mouseX = relX;
        mouseY = touch.clientY / window.innerHeight;
    });
    function updateCubePosition() {
        // حدود الحركة بحيث لا يخرج المكعب عن الشاشة
        const marginX = window.innerWidth * 0.09; // هامش يمنع الخروج
        const marginY = window.innerHeight * 0.09;
        const minX = window.innerWidth * 0.55 + marginX;
        const maxX = window.innerWidth * 0.95 - marginX;
        const minY = window.innerHeight * 0.10 + marginY;
        const maxY = window.innerHeight * 0.80 - marginY;
        const px = minX + (maxX - minX) * mouseX;
        const py = minY + (maxY - minY) * mouseY;
        const x = ((px / window.innerWidth) * 2 - 1) * 4;
        const y = -((py / window.innerHeight) * 2 - 1) * 3;
        cubeGroup.position.x += (x - cubeGroup.position.x) * 0.15;
        cubeGroup.position.y += (y - cubeGroup.position.y) * 0.15;
        cubeGroup.rotation.x += 0.01 + (mouseY - 0.5) * 0.2;
        cubeGroup.rotation.y += 0.01 + (mouseX - 0.5) * 0.2;
    }
    return updateCubePosition;
}

const updateCubePosition = addMouseInteraction();

function animate() {
    requestAnimationFrame(animate);
    
    // تحديث موقع المكعب
    updateCubePosition();
    
    // تحديث الجزيئات
    particles.forEach(particle => {
        particle.rotation.x += 0.001;
        particle.rotation.y += 0.001;
    });
    
    // تأثير التوهج
    if (cube) {
        cube.material.forEach(material => {
            material.opacity = 0.9 + Math.sin(Date.now() * 0.002) * 0.1;
            material.emissiveIntensity = 0.2 + Math.sin(Date.now() * 0.001) * 0.1;
        });
    }
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.querySelector('.hero-3d-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function showPhonePopup(x, y) {
    hidePhonePopup();
    phonePopup = document.createElement('div');
    phonePopup.className = 'phone-popup';
    phonePopup.innerHTML = `
        <div class="popup-content">
            <div class="user-info">
                <h3>وليد</h3>
                <div class="phone-container">
                    <span class="phone-number">00963948530541</span>
                    <button class="copy-btn">
                        <i class="fas fa-copy"></i>
                        نسخ
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(phonePopup);

    // تحديد موقع النافذة المنبثقة
    const popupRect = phonePopup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // حساب الموقع الأمثل للنافذة المنبثقة
    let left = x + 20;
    let top = y - popupRect.height / 2;

    // التأكد من أن النافذة المنبثقة لا تخرج عن حدود الشاشة
    if (left + popupRect.width > viewportWidth) {
        left = x - popupRect.width - 20;
    }
    if (top + popupRect.height > viewportHeight) {
        top = viewportHeight - popupRect.height - 20;
    }
    if (top < 20) {
        top = 20;
    }

    phonePopup.style.left = left + 'px';
    phonePopup.style.top = top + 'px';
    phonePopup.style.opacity = '1';

    // إضافة تأثيرات التحريك
    phonePopup.style.transform = 'scale(0.9)';
    setTimeout(() => {
        phonePopup.style.transform = 'scale(1)';
    }, 50);

    // إضافة وظيفة النسخ
    const copyBtn = phonePopup.querySelector('.copy-btn');
    copyBtn.onclick = function(e) {
        e.stopPropagation();
        navigator.clipboard.writeText('00963948530541');
        this.innerHTML = '<i class="fas fa-check"></i> تم النسخ!';
        this.classList.add('copied');
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-copy"></i> نسخ';
            this.classList.remove('copied');
        }, 1500);
    };

    // إخفاء النافذة المنبثقة بعد 5 ثواني
    setTimeout(() => {
        if (phonePopup) {
            phonePopup.style.transform = 'scale(0.9)';
            phonePopup.style.opacity = '0';
            setTimeout(() => {
                if (phonePopup) {
                    phonePopup.remove();
                    phonePopup = null;
                }
            }, 300);
        }
    }, 5000);
}

function hidePhonePopup() {
    if (phonePopup) {
        phonePopup.remove();
        phonePopup = null;
    }
}

document.addEventListener('click', function(e) {
    if (phonePopup && !e.target.classList.contains('copy-btn') && !e.target.classList.contains('phone-number')) {
        hidePhonePopup();
    }
});

// إضافة الأنماط CSS للنافذة المنبثقة
const style = document.createElement('style');
style.textContent = `
    .phone-popup {
        position: fixed;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transition: all 0.3s ease;
        min-width: 250px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .popup-content {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .user-info h3 {
        margin: 0;
        color: #333;
        font-size: 1.2em;
        font-weight: 600;
    }

    .phone-container {
        display: flex;
        align-items: center;
        gap: 10px;
        background: #f5f5f5;
        padding: 8px 12px;
        border-radius: 8px;
    }

    .phone-number {
        font-family: monospace;
        font-size: 1.1em;
        color: #333;
    }

    .copy-btn {
        background: #12F906;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: all 0.2s ease;
        font-size: 0.9em;
    }

    .copy-btn:hover {
        background: #0fd800;
        transform: translateY(-1px);
    }

    .copy-btn.copied {
        background: #4CAF50;
    }

    @media (max-width: 480px) {
        .phone-popup {
            min-width: 200px;
            padding: 15px;
        }

        .phone-container {
            flex-direction: column;
            align-items: stretch;
        }

        .copy-btn {
            width: 100%;
            justify-content: center;
        }
    }
`;
document.head.appendChild(style);

// بدء التطبيق
init(); 