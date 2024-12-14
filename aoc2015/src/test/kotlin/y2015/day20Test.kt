package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.*
import java.io.File

class day20Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun testActual() {
        assertEquals(786240, day20())
    }

    @Test
    fun testActualSecond() {
        assertEquals(831600, day20Second())
    }
}


