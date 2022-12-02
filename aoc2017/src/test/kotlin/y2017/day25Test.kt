package y2017

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.io.File

class day25Test {

    fun parseFile(name: String): MutableList<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        return ArrayList(File(fileUri).readLines())
    }

    @Test
    fun test1() {
        assertEquals(3, day25(parseFile("2017/day25TestInput.txt")))
    }

    @Test
    fun testActual() {
        assertEquals(2725, day25(parseFile("2017/day25ActualInput.txt")))
    }
}
